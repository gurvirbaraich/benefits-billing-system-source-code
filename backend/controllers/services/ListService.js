export default async function ListService(request, { DB }) {
  try {
    const output = await DB.prepare("SELECT * FROM Services").run();

    const servicesObject = {};

    for (let i = 0; i < output.results.length; i++) {
      const service = output.results[i];

      if (servicesObject[service.ServiceTransaction] === undefined) {
        servicesObject[service.ServiceTransaction] = [service];
      } else if (servicesObject[service.ServiceTransaction] != undefined) {
        servicesObject[service.ServiceTransaction].push(service);
      }
    }

    return {
      status: "OK!!",
      services: Object.values(servicesObject),
    };
  } catch (error) {
    return {
      status: "Failed!!",
      message: error.message,
    };
  }
}
