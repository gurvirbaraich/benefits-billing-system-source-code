export default async function ListCustomer(request, { DB }) {
  try {
    const output = await DB.prepare(
      `
        SELECT * FROM CustomerLinker
          LEFT JOIN Customer 
            ON Customer.CustomerID = CustomerLinker.CustomerID
          
          LEFT JOIN CustomerAddresses 
            ON CustomerAddresses.CustomerAddressID = CustomerLinker.CustomerAddressID
          
          LEFT JOIN CustomerContact 
            ON CustomerContact.CustomerContactID = CustomerLinker.CustomerContactID
      `
    ).run();

    return {
      status: "OK!!",
      customers: output.results,
    };
  } catch (error) {
    // Throw an error.
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
