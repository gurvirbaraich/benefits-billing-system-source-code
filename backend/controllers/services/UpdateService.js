export default async function (request, { DB }) {
  try {
    // Getting the JSON sent from the client.
    const jsonObject = await request.json();

    // Getting the service details and transactionID.
    const { action } = jsonObject;
    const { price, unit, quantity, transactionID, customersLinked } =
      await jsonObject.service;

    if (action === "delete.links") {
      await DB.batch([
        DB.prepare("DELETE FROM Services WHERE ServiceTransaction = ?").bind(
          transactionID
        ),
        await DB.prepare(
          "INSERT INTO Services ( \
          ServiceUnit, \
          ServicePrice, \
          ServiceQuantity, \
          ServiceCustomerID, \
          ServiceTransaction \
          ) VALUES (?, ?, ?, null, ?)"
        ).bind(unit, price, quantity, transactionID),
      ]);
    } else if (action === "set.links") {
      const customers = customersLinked.split(",");

      await DB.prepare("DELETE FROM Services WHERE ServiceTransaction = ?")
        .bind(transactionID)
        .run();

      await DB.batch(
        customers.flatMap((customerID) =>
          DB.prepare(
            "INSERT INTO Services ( \
            ServiceUnit, \
            ServicePrice, \
            ServiceQuantity, \
            ServiceCustomerID, \
            ServiceTransaction \
            ) VALUES (?, ?, ?, ?, ?)"
          ).bind(
            jsonObject.service.unit,
            jsonObject.service.price,
            jsonObject.service.quantity,
            customerID,
            transactionID
          )
        )
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
