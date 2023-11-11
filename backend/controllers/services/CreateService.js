export default async function CreateService(request, { DB }) {
  try {
    // Getting the JSON sent from the client.
    const jsonObject = await request.json();

    // Getting the customers linked to the service.
    const { customersLinked } = jsonObject.service;

    const output = await DB.prepare(
      "INSERT INTO ServiceTransaction (timestamp) VALUES (?) RETURNING *"
    )
      .bind(Date.now())
      .run();

    const { ServiceTransaction } = output.results[0];

    if (customersLinked) {
      const customers = customersLinked.split(",");

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
            ServiceTransaction
          )
        )
      );
    } else if (!customersLinked) {
      await DB.prepare(
        "INSERT INTO Services ( \
        ServiceUnit, \
        ServicePrice, \
        ServiceQuantity, \
        ServiceCustomerID, \
        ServiceTransaction \
        ) VALUES (?, ?, ?, null, ?)"
      )
        .bind(
          jsonObject.service.unit,
          jsonObject.service.price,
          jsonObject.service.quantity,
          ServiceTransaction
        )
        .run();
    }

    return {
      status: "OK!!",
    };
  } catch (error) {
    // Throw an error!
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
