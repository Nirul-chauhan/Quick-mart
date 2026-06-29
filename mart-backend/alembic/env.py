from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context
from app.core.database import Base
import app.models



"""add countries states cities stores categories

Revision ID: 0002
Revises: 0001
Create Date: 2024-01-02
"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels = depends_on = None


def upgrade() -> None:
    op.create_table("countries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("country_name", sa.String(100), nullable=False, unique=True),
    )
    op.create_table("states",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("state_name", sa.String(100), nullable=False),
        sa.Column("country_id", sa.Integer(), sa.ForeignKey("countries.id", ondelete="RESTRICT"), nullable=False),
    )
    op.create_table("cities",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("city_name", sa.String(100), nullable=False),
        sa.Column("state_id", sa.Integer(), sa.ForeignKey("states.id", ondelete="RESTRICT"), nullable=False),
    )
    op.create_table("stores",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("store_no", sa.String(50), nullable=False, unique=True),
        sa.Column("logo", sa.String(500), nullable=True),
        sa.Column("store_addr", sa.Text(), nullable=False),
        sa.Column("store_city_id", sa.Integer(), sa.ForeignKey("cities.id", ondelete="RESTRICT"), nullable=False),
    )
    op.create_table("categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("category_name", sa.String(150), nullable=False),
        sa.Column("cat_img", sa.String(500), nullable=True),
        sa.Column("parent_category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
    )

    # Seed data
    op.execute("INSERT INTO countries (country_name) VALUES ('India'),('USA'),('UK')")
    op.execute("""INSERT INTO states (state_name, country_id) VALUES
        ('Uttar Pradesh',1),('Maharashtra',1),('Delhi',1),('Karnataka',1),
        ('California',2),('New York',2)""")
    op.execute("""INSERT INTO cities (city_name, state_id) VALUES
        ('Noida',1),('Ghaziabad',1),('Lucknow',1),
        ('Mumbai',2),('Pune',2),
        ('New Delhi',3),
        ('Bengaluru',4),
        ('Los Angeles',5),('San Francisco',5),
        ('New York City',6)""")
    op.execute("""INSERT INTO categories (category_name, cat_img, parent_category_id) VALUES
        ('Fruits & Vegetables',NULL,NULL),
        ('Dairy & Breakfast',NULL,NULL),
        ('Snacks & Munchies',NULL,NULL),
        ('Cold Drinks & Juices',NULL,NULL),
        ('Fresh Apples',NULL,1),
        ('Bananas',NULL,1),
        ('Milk',NULL,2),
        ('Eggs',NULL,2),
        ('Chips',NULL,3),
        ('Soft Drinks',NULL,4)""")


def downgrade() -> None:
    op.drop_table("categories")
    op.drop_table("stores")
    op.drop_table("cities")
    op.drop_table("states")
    op.drop_table("countries")
# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata =  Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
