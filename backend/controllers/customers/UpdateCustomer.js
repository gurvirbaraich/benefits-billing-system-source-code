export default async function UpdateCustomer(request, { DB }) {
  try {
    // Getting the JSON send from the client.
    const jsonObject = await request.json();

    // What are we trying to update?
    const updatingAction = jsonObject.updatingAction;

    // Getting the basic fields to update.
    const customerID = jsonObject.link.CustomerID;
    const customerName = jsonObject.customer.name;
    const customerEmployeeCount = jsonObject.customer.employeeCount;

    if (updatingAction === "address") {
      await DB.batch([
        DB.prepare(
          "UPDATE Customer SET CustomerName = ?, CustomerEmployeeCount = ? WHERE CustomerID = ?"
        ).bind(customerName, customerEmployeeCount, customerID),

        DB.prepare(
          "UPDATE CustomerAddresses SET \
            `CustomerCity` = ?, \
            `CustomerZipCode` = ?, \
            `CustomerStateCode` = ?, \
            `CustomerStreetAddress` = ?, \
            \
            `CustomerAddressHQ` = ?, \
            `CustomerAddressPrimary` = ? WHERE `CustomerAddressID` = ?"
        ).bind(
          jsonObject.address.city,
          jsonObject.address.zipCode,
          jsonObject.address.stateCode,
          jsonObject.address.streetAddress,

          jsonObject.address.HQ,
          jsonObject.address.primary,

          jsonObject.address.ID
        ),
      ]);
    } else if (updatingAction === "contact") {
      await DB.batch([
        DB.prepare(
          "UPDATE Customer SET CustomerName = ?, CustomerEmployeeCount = ? WHERE CustomerID = ?"
        ).bind(customerName, customerEmployeeCount, customerID),

        DB.prepare(
          "UPDATE CustomerContact SET \
            `CustomerPhonePrefix` = ?, \
            `CustomerPhoneNumber` = ?, \
            `CustomerContactName` = ?, \
            `CustomerContactEmail` = ? WHERE `CustomerContactID` = ?"
        ).bind(
          jsonObject.contact.phonePrefix,
          jsonObject.contact.phoneNumber,
          jsonObject.contact.name,
          jsonObject.contact.email,
          jsonObject.contact.ID
        ),

        DB.prepare(
          "UPDATE CustomerLinker SET CustomerAddressID = ? WHERE CustomerContactID = ?"
        ).bind(jsonObject.link.AddressID, jsonObject.contact.ID),
      ]);
    }

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
