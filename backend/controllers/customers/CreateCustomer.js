export default async function CreateCustomer(request, { DB }) {
  try {
    /**
     ** Steps to create a new customer.
     **
     ** 1) Store the customer details in the database.
     ** 2) Link all the pieces together.
     */

    // Getting the JSON send from the client.
    const jsonObject = await request.json();

    const output = await DB.batch([
      // Create new customer SQL.
      DB.prepare(
        "INSERT INTO Customer (`CustomerName`, `CustomerEmployeeCount`) VALUES (?, ?) RETURNING *"
      ).bind(jsonObject.customer.name, jsonObject.customer.employeeCount),

      // Create new customer address SQL.
      DB.prepare(
        "INSERT INTO CustomerAddresses \
        ( \
          `CustomerCity`, \
          `CustomerZipCode`, \
          `CustomerStateCode`, \
          `CustomerStreetAddress`, \
          \
          `CustomerAddressHQ`, \
          `CustomerAddressPrimary`\
        ) VALUES (?, ?, ?, ?, ?, ?) RETURNING *"
      ).bind(
        jsonObject.address.city,
        jsonObject.address.zipCode,
        jsonObject.address.stateCode,
        jsonObject.address.streetAddress,

        jsonObject.address.HQ,
        jsonObject.address.primary
      ),

      // Create new customer contact SQL.
      DB.prepare(
        "INSERT INTO CustomerContact \
        (\
          `CustomerPhonePrefix`, \
          `CustomerPhoneNumber`, \
          `CustomerContactName`, \
          `CustomerContactEmail` \
        ) VALUES (?, ?, ?, ?) RETURNING *"
      ).bind(
        jsonObject.contact.phonePrefix,
        jsonObject.contact.phoneNumber,
        jsonObject.contact.name,
        jsonObject.contact.email
      ),
    ]);

    // Getting all the primary keys from the tables.
    const [{ CustomerID }, { CustomerAddressID }, { CustomerContactID }] = [
      output[0].results[0],
      output[1].results[0],
      output[2].results[0],
    ];

    // Linking everything together
    await DB.prepare(
      "INSERT INTO CustomerLinker \
      (\
        `CustomerID`, \
        `CustomerAddressID`, \
        `CustomerContactID`\
      ) VALUES (?, ?, ?) RETURNING *"
    ).bind(CustomerID, CustomerAddressID, CustomerContactID).run();

    return {
      status: "OK!!",
    };
  } catch (error) {
    // Sending back the error message.
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
