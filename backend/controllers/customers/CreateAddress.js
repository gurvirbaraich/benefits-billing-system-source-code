export default async function (request, { DB }) {
  /**
   ** Steps to create a new contact for an existing record
   **
   ** 1) Create a new contact
   ** 2) Link it to the existing customer
   */

  try {
    // Getting the JSON send from the client.
    const jsonObject = await request.json();

    // Create new customer address SQL.
    const output = await DB.prepare(
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
    )
      .bind(
        jsonObject.address.city,
        jsonObject.address.zipCode,
        jsonObject.address.stateCode,
        jsonObject.address.streetAddress,

        jsonObject.address.HQ,
        jsonObject.address.primary
      )
      .run();

    // Getting the ID of recently created contact
    const { CustomerAddressID } = output.results[0];

    // Linking everything together.
    await DB.prepare(
      "INSERT INTO CustomerLinker \
      (\
        `CustomerID`, \
        `CustomerAddressID`, \
        `CustomerContactID`\
      ) VALUES (?, ?, null) RETURNING *"
    )
      .bind(
        jsonObject.link.CustomerID,
        CustomerAddressID,
      )
      .run();

    return {
      status: "OK!!",
    };
  } catch (error) {
    // Throw an error.
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
