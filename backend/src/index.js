import CreateAddress from "../controllers/customers/CreateAddress";
import CreateContact from "../controllers/customers/CreateContact";
import CreateCustomer from "../controllers/customers/CreateCustomer";
import DeleteCustomer from "../controllers/customers/DeleteCustomer";
import ListCustomer from "../controllers/customers/ListCustomers";
import UpdateCustomer from "../controllers/customers/UpdateCustomer";

export default {
  async fetch(request, env, ctx) {
    const paths = {
      "/": {
        method: "GET",
        handler: () => {
          return {
            status: 200,
            message: "OK!!",
          };
        },
      },

      "/customer/create": {
        method: "POST",
        handler: CreateCustomer,
      },

      "/customer/list": {
        method: "GET",
        handler: ListCustomer,
      },

      "/customer/link/contact": {
        method: "POST",
        handler: CreateContact,
      },

      "/customer/link/address": {
        method: "POST",
        handler: CreateAddress,
      },

      "/customer/update/address": {
        method: "POST",
        handler: UpdateCustomer,
      },

      "/customer/update/contact": {
        method: "POST",
        handler: UpdateCustomer,
      },

      "/customer/delete": {
        method: "POST",
        handler: DeleteCustomer,
      },
    };

    return Response.json(await getComputedObject(paths)(request, env), {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST",
    });
  },
};

function getComputedObject(paths) {
  return async (request, env) => {
    // Getting the pathname of the requested URL.
    const { pathname } = new URL(request.url);

    // Getting all the registered paths.
    const keys = Object.keys(paths);

    // if the requested path is not registered.
    if (!keys.includes(pathname)) {
      // Throw an error.
      return {
        status: "Failed!!",
        message: `Could't find the requested path!`,
      };
    }

    // Getting the requested method of the requested URL.
    const { method, handler } = paths[pathname];

    // Checking if the requested method does not matched the method for requested path.
    if (method !== request.method) {
      // Throw an error.
      return {
        status: 405,
        message: `${request.method} not allowed for requested path!`,
      };
    }

    // Executing the handler for the requested path.
    return await handler(request, env);
  };
}
