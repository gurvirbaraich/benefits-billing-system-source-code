DROP TABLE IF EXISTS CustomerLinker;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS CustomerContact;
DROP TABLE IF EXISTS CustomerAddresses;

CREATE TABLE Customer (
  CustomerID INTEGER PRIMARY KEY,
  
  CustomerName VARCHAR(200) NOT NULL,
  isActive INTEGER NOT NULL DEFAULT 1,
  CustomerEmployeeCount INTEGER NOT NULL
);


CREATE TABLE CustomerAddresses (
  CustomerAddressID INTEGER PRIMARY KEY,

  CustomerCity VARCHAR(100) NOT NULL,
  CustomerZipCode VARCHAR(10) NOT NULL,
  CustomerStateCode VARCHAR(2) NOT NULL,
  CustomerStreetAddress VARCHAR(300) NOT NULL,

  CustomerAddressHQ INTEGER NOT NULL,
  CustomerAddressPrimary INTEGER NOT NULL
);


CREATE TABLE CustomerContact (
  CustomerContactID INTEGER PRIMARY KEY,
  
  CustomerPhonePrefix VARCHAR(5) NOT NULL,
  CustomerPhoneNumber VARCHAR(10) NOT NULL,
  CustomerContactName VARCHAR(200) NOT NULL,
  CustomerContactEmail VARCHAR(200) NOT NULL
);


CREATE TABLE CustomerLinker (
  LinkerID INTEGER PRIMARY KEY,

  CustomerID INTEGER,
  CustomerAddressID INTEGER,
  CustomerContactID INTEGER,

  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
  FOREIGN KEY (CustomerAddressID) REFERENCES CustomerAddresses(CustomerAddressID),
  FOREIGN KEY (CustomerContactID) REFERENCES CustomerContact(CustomerContactID)
);
