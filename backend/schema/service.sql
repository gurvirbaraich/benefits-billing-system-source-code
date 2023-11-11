DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS ServiceTransaction;

CREATE TABLE ServiceTransaction (
  ServiceTransaction INTEGER PRIMARY KEY,
  timestamp Varchar(255) NOT NULL
);

CREATE TABLE Services (
  ServiceID INTEGER PRIMARY KEY,
  ServicePrice INTEGER NOT NULL,
  ServiceQuantity INTEGER NOT NULL,
  ServiceUnit Varchar(255) NOT NULL,
  ServiceTransaction INTEGER NOT NULL,
  ServiceCustomerID INTEGER DEFAULT NULL,

  FOREIGN KEY (ServiceCustomerID) REFERENCES Customer(CustomerID)
  FOREIGN KEY (ServiceTransaction) REFERENCES ServiceTransaction(ServiceTransaction)
)