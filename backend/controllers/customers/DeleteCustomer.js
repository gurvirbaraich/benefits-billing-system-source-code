export default async function DeleteCustomer(request, { DB }) {
  try {
    // Getting JSON send from the client.
    const jsonObject = await request.json();

    const output = await DB.prepare(
      "SELECT * FROM CustomerLinker WHERE CustomerID = ?"
    )
      .bind(jsonObject.customerID)
      .run();

    if (output.results.length > 0) {
      await DB.batch(
        output.results.map((linker) =>
          DB.prepare("DELETE FROM CustomerLinker WHERE LinkerID = ?").bind(
            linker.LinkerID
          )
        )
      );

      await DB.batch(
        output.results.flatMap((linker) => [
          DB.prepare("DELETE FROM Customer WHERE CustomerID = ?").bind(
            linker.CustomerID
          ),
          DB.prepare(
            "DELETE FROM CustomerAddresses WHERE CustomerAddressID = ?"
          ).bind(linker.CustomerAddressID),
          DB.prepare(
            "DELETE FROM CustomerContact WHERE CustomerContactID = ?"
          ).bind(linker.CustomerContactID),
        ])
      );
    }

    return {
      status: "OK!!",
    };
  } catch (error) {
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
