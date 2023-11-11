export default async function DeleteService(request, { DB }) {
  try {
    // Getting the JSON sent by the clinet.
    const jsonObject = await request.json();

    // Getting the transactionID
    const ServiceTransactionID = jsonObject.service.transactionID;

    await DB.batch([
      DB.prepare("DELETE FROM Services WHERE ServiceTransaction = ?").bind(
        ServiceTransactionID
      ),
      DB.prepare(
        "DELETE FROM ServiceTransaction WHERE ServiceTransaction = ?"
      ).bind(ServiceTransactionID),
    ]);

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
