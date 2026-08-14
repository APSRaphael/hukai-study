"""add users.avatar

Revision ID: 0002_add_user_avatar
Revises: 0001_create_users
Create Date: 2026-08-14
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002_add_user_avatar"
down_revision: str | None = "0001_create_users"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "avatar",
            sa.String(length=512),
            nullable=True,
            comment="头像访问路径",
        ),
    )


def downgrade() -> None:
    op.drop_column("users", "avatar")
