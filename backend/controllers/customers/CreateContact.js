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

    // Create new customer contact SQL.
    const output = await DB.prepare(
      "INSERT INTO CustomerContact \
      (\
        `CustomerPhonePrefix`, \
        `CustomerPhoneNumber`, \
        `CustomerContactName`, \
        `CustomerContactEmail` \
      ) VALUES (?, ?, ?, ?) RETURNING *"
    )
      .bind(
        jsonObject.contact.phonePrefix,
        jsonObject.contact.phoneNumber,
        jsonObject.contact.name,
        jsonObject.contact.email
      )
      .run();

    // Getting the ID of recently created contact
    const { CustomerContactID } = output.results[0];

    // Linking everything together.
    await DB.prepare(
      "INSERT INTO CustomerLinker \
      (\
        `CustomerID`, \
        `CustomerAddressID`, \
        `CustomerContactID`\
      ) VALUES (?, ?, ?) RETURNING *"
    ).bind(jsonObject.link.CustomerID, jsonObject.link.CustomerAddressID, CustomerContactID).run();

    return {
      status: "OK!!",
    }
  } catch (error) {
    // Throw an error.
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
