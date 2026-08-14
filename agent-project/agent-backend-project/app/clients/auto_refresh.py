"""带自动刷新的 HTTP 客户端：access 过期时用 refresh 换新令牌并重试原请求。"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

import httpx


class AutoRefreshClient:
    """封装 httpx.AsyncClient：401 时刷新 access_token 后自动重试一次。"""

    def __init__(
        self,
        client: httpx.AsyncClient,
        *,
        access_token: str,
        refresh_token: str,
        refresh_path: str = "/auth/refresh",
    ) -> None:
        self._client = client
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.refresh_path = refresh_path

    def _auth_headers(
        self, headers: Mapping[str, str] | None = None
    ) -> dict[str, str]:
        merged = dict(headers or {})
        merged["Authorization"] = f"Bearer {self.access_token}"
        return merged

    async def _refresh(self) -> None:
        resp = await self._client.post(
            self.refresh_path,
            json={"refresh_token": self.refresh_token},
        )
        resp.raise_for_status()
        body = resp.json()
        self.access_token = body["access_token"]
        self.refresh_token = body["refresh_token"]

    async def request(
        self,
        method: str,
        url: str,
        *,
        headers: Mapping[str, str] | None = None,
        **kwargs: Any,
    ) -> httpx.Response:
        """发送请求；若 401 则刷新令牌并重试原请求一次。"""
        resp = await self._client.request(
            method, url, headers=self._auth_headers(headers), **kwargs
        )
        if resp.status_code != 401:
            return resp

        await self._refresh()
        return await self._client.request(
            method, url, headers=self._auth_headers(headers), **kwargs
        )

    async def get(self, url: str, **kwargs: Any) -> httpx.Response:
        return await self.request("GET", url, **kwargs)

    async def post(self, url: str, **kwargs: Any) -> httpx.Response:
        return await self.request("POST", url, **kwargs)

    async def put(self, url: str, **kwargs: Any) -> httpx.Response:
        return await self.request("PUT", url, **kwargs)

    async def delete(self, url: str, **kwargs: Any) -> httpx.Response:
        return await self.request("DELETE", url, **kwargs)
