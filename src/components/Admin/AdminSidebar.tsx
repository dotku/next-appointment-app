import { Badge } from "@nextui-org/react";

export default function AdminSidebar() {
  return (
    <>
      <h2 className="text-2xl">Administration</h2>
      <p className="text-gray-400">
        This administration could be used for internal mangament or support
        assistant
      </p>
      <ul>
        <li className="mt-12 lg:mt-8">
          <h5 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
            Dashboard
          </h5>
          <ul className="space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800">
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 bg-gray-300"
                href="#"
              >
                General
              </a>
            </li>
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                href="#"
              >
                <Badge content="99+" shape="circle" color="danger" size="sm">
                  Tasks
                </Badge>
              </a>
            </li>
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                href="#"
              >
                Traffic
              </a>
            </li>
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                href="#"
                title="Not sure what would be the right content for business manager
                  to manage yet"
              >
                Operation
              </a>
            </li>
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                href="#"
              >
                Finance
              </a>
            </li>
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                href="#"
              >
                Customer Support
              </a>
            </li>
            <li>
              <a
                className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                href="#"
              >
                Knwoldege Base
              </a>
            </li>
          </ul>
        </li>
        <li className="mt-12 lg:mt-8">
          <h5 className="mb-8 lg:mb-3  text-slate-900 dark:text-slate-200">
            Appointments
          </h5>
        </li>

        <li className="mt-12 lg:mt-8">
          <h5 className="mb-8 lg:mb-3  text-slate-900 dark:text-slate-200">
            Customers
          </h5>
        </li>
        <li className="mt-12 lg:mt-8">
          <h5 className="mb-8 lg:mb-3 text-slate-900 dark:text-slate-200">
            Business
          </h5>
        </li>
        <li className="mt-12 lg:mt-8">
          <h5 className="mb-8 lg:mb-3 text-slate-900 dark:text-slate-200">
            Specialist
          </h5>
        </li>
        <li className="mt-12 lg:mt-8">
          <h5 className="mb-8 lg:mb-3  text-slate-900 dark:text-slate-200">
            Services
          </h5>
        </li>
      </ul>
    </>
  );
}
