class FileStorage {
  private db: IDBDatabase | null = null;
  private dbName = 'fileStore';
  private storeName = 'files';
  private openCallback: () => void;

  constructor(open = () => {}) {
    this.openCallback = open;
    this.openDatabase();
  }

  // 打开或创建数据库
  private openDatabase(): void {
    const request = indexedDB.open(this.dbName, 1);
    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      if (!this.db.objectStoreNames.contains(this.storeName)) {
        this.db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.openCallback();
    };

    request.onerror = (event) => {
      console.error('Error opening database:', event);
    };
  }

  // 插入整个fileList数组
  public async insertFileList(fileList: fileInfoWithId[]): Promise<void> {
    const fileContents = await Promise.all(
      fileList.map((file) => this.readFileAsArrayBuffer(file.raw))
    );

    await this.transaction(async (transaction) => {
      const objectStore = transaction.objectStore(this.storeName);
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const content = fileContents[i];
        await this.insertObjectStore(objectStore, { ...file, content });
      }
    });
  }

  // 插入单个 fileInfo
  public async insertFile(fileInfo: fileInfoWithId): Promise<void> {
    this.insertFileList([fileInfo]);
  }

  // 读取文件为ArrayBuffer
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (error) => reject(error);
    });
  }

  // 插入对象到 objectStore
  private async insertObjectStore(
    objectStore: IDBObjectStore,
    file: fileInfoWithId & { content: ArrayBuffer }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = objectStore.add(file);
      request.onsuccess = () => resolve();
      request.onerror = (error) => reject(error);
    });
  }

  // 根据 ID 列表删除数据
  public async deleteByIds(ids: number[]): Promise<void> {
    await this.transaction(async (transaction) => {
      const objectStore = transaction.objectStore(this.storeName);
      for (const id of ids) {
        const request = objectStore.delete(id);
        await this.waitForRequest(request);
      }
    });
  }

  // 根据单个ID删除数据

  public async deleteById(id: number): Promise<void> {
    await this.transaction(async (transaction) => {
      const objectStore = transaction.objectStore(this.storeName);
      const exists = await this.checkIfExists(objectStore, id);
      if (!exists) {
        console.warn(`No file found width id ${id}`);
        return;
      }
      console.log(`Deleting file with id ${id}`);
      const request = objectStore.delete(id);
      await this.waitForRequest(request);
    });
  }

  // 检查是否存在指定 ID 的数据
  private async checkIfExists(
    objectStore: IDBObjectStore,
    id: number
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const getRequest = objectStore.get(id);

      getRequest.onsuccess = () => {
        resolve(getRequest.result !== undefined);
      };

      getRequest.onerror = (error) => {
        console.error('Check existence error:', error);
        resolve(false);
      };
    });
  }

  private async transaction<T>(
    callback: (transaction: IDBTransaction) => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      callback(transaction).then(resolve).catch(reject);
      transaction.oncomplete = () => {
        console.log('Transaction completed');
      };
      transaction.onerror = (error) => {
        console.error('Transaction error:', error);
        reject(error);
      };
    });
  }

  private waitForRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (error) => {
        console.error('Request error:', error);
        reject(error);
      };
    });
  }
}
