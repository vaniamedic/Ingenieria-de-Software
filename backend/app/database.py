from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configura tus credenciales de PostgreSQL
#DATABASE_URL = "postgresql://usuario:password@localhost:5432/mi_basedatos"
DATABASE_URL = "postgresql://vanitamedicrendic:@localhost:5432/ingsoftware_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()