import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import logoDarkSrc from '@/Admin/images/logo/logo-dark.svg';
import logoIconSrc from '@/Admin/images/logo/logo-icon.svg';

// Small helper to compose class names conditionally
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Props
 * - sidebarToggle: boolean (collapsed state coming from parent)
 * - page: string (current page key, e.g. 'ecommerce', 'calendar', etc.)
 * - logoLight / logoDark / logoIcon: optional src strings
 */
export default function Sidebar({
  sidebarToggle = false,
  page = "",
  mainPage = "",
  logoLight = "/images/logo-dark.svg",
  logoDark = "/images/logo.svg",
  logoIcon = logoIconSrc,
}) {
  const [selected, setSelected] = useState(mainPage);

  // Derived classes for the aside wrapper
  const asideClass = useMemo(
    () =>
      cn(
        sidebarToggle ? "translate-x-0 lg:w-[90px]" : "-translate-x-full",
        "sidebar fixed left-0 top-0 z-[9999] flex h-screen w-[290px] flex-col overflow-y-hidden border-r border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-black lg:static lg:translate-x-0"
      ),
    [sidebarToggle]
  );

  return (
    <aside className={asideClass}>
      {/* SIDEBAR HEADER */}
      <div
        className={cn(
          sidebarToggle ? "justify-center" : "justify-between",
          "flex items-center gap-2 pt-8 sidebar-header pb-7"
        )}
      >
        <a href="#">
          <span className={cn("logo", sidebarToggle ? "hidden" : "")}
            aria-label="Logo">
            {/* Light mode */}
            <img className="dark:hidden" src={logoLight} alt="Logo" width={40}/>
            {/* Dark mode */}
            <img className="hidden dark:block" src={logoDark} alt="Logo" width={50}/>
          </span>

          <img
            className={cn("logo-icon", sidebarToggle ? "lg:block" : "hidden")}
            src={logoLight}
            alt="Logo icon"
            width={35}
          />
        </a>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {/* Sidebar Menu */}
        <nav>
          {/* Menu Group */}
          <div>
            <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
              <span className={cn("menu-group-title", sidebarToggle ? "lg:hidden" : "")}>MENU</span>

              <svg
                className={cn("mx-auto fill-current menu-group-icon", sidebarToggle ? "lg:block hidden" : "hidden")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
                  fill="currentColor"
                />
              </svg>
            </h3>

            <ul className="flex flex-col gap-4 mb-6">
              {/* Menu Item Dashboard */}
              {/* <li>
                <Link href="#"
                  onClick={() => setSelected((prev) => (prev === "Dashboard" ? "" : "Dashboard"))}
                  className={cn(
                    "menu-item group",
                    selected === "Dashboard"
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  )}
                >
                  <svg
                    className={cn(
                      selected === "Dashboard"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    )}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className={cn("menu-item-text", sidebarToggle ? "lg:hidden" : "")}>Dashboard</span>
                </Link>
              </li> */}
              {/* Menu Item Dashboard */}

              {/* Menu Item Calendar */}
              <li>
                <Link href={route('admin.orders.index')}
                  onClick={() => setSelected((prev) => (prev === "Orders" ? "" : "Orders"))}
                  className={cn(
                    "menu-item group",
                    selected === "Orders" && page === "orders"
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  )}
                >
                  <svg
                    className={cn(
                      selected === "Orders" && page === "orders"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    )}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H18.5001C19.7427 20.75 20.7501 19.7426 20.7501 18.5V5.5C20.7501 4.25736 19.7427 3.25 18.5001 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H18.5001C18.9143 4.75 19.2501 5.08579 19.2501 5.5V18.5C19.2501 18.9142 18.9143 19.25 18.5001 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V5.5ZM6.25005 9.7143C6.25005 9.30008 6.58583 8.9643 7.00005 8.9643L17 8.96429C17.4143 8.96429 17.75 9.30008 17.75 9.71429C17.75 10.1285 17.4143 10.4643 17 10.4643L7.00005 10.4643C6.58583 10.4643 6.25005 10.1285 6.25005 9.7143ZM6.25005 14.2857C6.25005 13.8715 6.58583 13.5357 7.00005 13.5357H17C17.4143 13.5357 17.75 13.8715 17.75 14.2857C17.75 14.6999 17.4143 15.0357 17 15.0357H7.00005C6.58583 15.0357 6.25005 14.6999 6.25005 14.2857Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className={cn("menu-item-text", sidebarToggle ? "lg:hidden" : "")}>Orders</span>
                </Link>
              </li>
              {/* Menu Item Calendar */}
              
              {/* Menu Item Tables */}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected((prev) => (prev === "Products" ? "" : "Products"));
                  }}
                  className={cn(
                    "menu-item group",
                    selected === "Products" || ["product", "create-product"].includes(page)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  )}
                >
                  <svg
                    className={cn(
                      selected === "Products" || ["product", "create-product"].includes(page)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    )}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.25 5.5C3.25 4.25736 4.25736 3.25 5.5 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5V8.58325L19.25 8.58325V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H5.5ZM19.25 10.0833H15.416V13.9165H19.25V10.0833ZM13.916 10.0833L10.083 10.0833V13.9165L13.916 13.9165V10.0833ZM8.58301 10.0833H4.75V13.9165H8.58301V10.0833ZM4.75 18.5V15.4165H8.58301V19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5ZM10.083 19.25V15.4165L13.916 15.4165V19.25H10.083ZM15.416 19.25V15.4165H19.25V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15.416Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className={cn("menu-item-text", sidebarToggle ? "lg:hidden" : "")}>Products</span>

                  <svg
                    className={cn(
                      "menu-item-arrow",
                      selected === "Products" ? "menu-item-arrow-active" : "menu-item-arrow-inactive",
                      sidebarToggle ? "lg:hidden" : ""
                    )}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                
                {/* Dropdown Menu Start */}
                <div
                  className={cn(
                    "overflow-hidden transform translate",
                    selected === "Products" ? "block" : "hidden"
                  )}
                >
                  <ul className={cn("flex flex-col gap-1 mt-2 menu-dropdown pl-9", sidebarToggle ? "lg:hidden" : "flex")}>
                    <li>
                      <Link href={route('admin.categories.index')}
                        className={cn(
                          "menu-dropdown-item group",
                          ["categories", "create-category"].includes(page)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        )}
                      >
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link href={route('admin.products.index')}
                        className={cn(
                          "menu-dropdown-item group",
                          ["product", "create-product"].includes(page)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        )}
                      >
                        Product List
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Dropdown Menu End */}
              </li>
              {/* Menu Item Tables */}
            </ul>
          </div>

          {/* CMS Group */}
          <div>
            <h3 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
              <span className={cn("menu-group-title", sidebarToggle ? "lg:hidden" : "")}>OTHERS</span>

              <svg
                className={cn("mx-auto fill-current menu-group-icon", sidebarToggle ? "lg:block hidden" : "hidden")}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
                  fill="currentColor"
                />
              </svg>
            </h3>
            <ul className="flex flex-col gap-4 mb-6">
              {/* Menu Item CMS */}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected((prev) => (prev === "CMS" ? "" : "CMS"));
                  }}
                  className={cn(
                    "menu-item group",
                    selected === "CMS" || ["sliders", "slider-create", "slider-edit"].includes(page)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  )}
                >
                  
                  <svg 
                    className={cn(
                      selected === "CMS" || ["sliders", "slider-create", "slider-edit"].includes(page)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    )}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path 
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.50391 4.25C8.50391 3.83579 8.83969 3.5 9.25391 3.5H15.2777C15.4766 3.5 15.6674 3.57902 15.8081 3.71967L18.2807 6.19234C18.4214 6.333 18.5004 6.52376 18.5004 6.72268V16.75C18.5004 17.1642 18.1646 17.5 17.7504 17.5H16.248V17.4993H14.748V17.5H9.25391C8.83969 17.5 8.50391 17.1642 8.50391 16.75V4.25ZM14.748 19H9.25391C8.01126 19 7.00391 17.9926 7.00391 16.75V6.49854H6.24805C5.83383 6.49854 5.49805 6.83432 5.49805 7.24854V19.75C5.49805 20.1642 5.83383 20.5 6.24805 20.5H13.998C14.4123 20.5 14.748 20.1642 14.748 19.75L14.748 19ZM7.00391 4.99854V4.25C7.00391 3.00736 8.01127 2 9.25391 2H15.2777C15.8745 2 16.4468 2.23705 16.8687 2.659L19.3414 5.13168C19.7634 5.55364 20.0004 6.12594 20.0004 6.72268V16.75C20.0004 17.9926 18.9931 19 17.7504 19H16.248L16.248 19.75C16.248 20.9926 15.2407 22 13.998 22H6.24805C5.00541 22 3.99805 20.9926 3.99805 19.75V7.24854C3.99805 6.00589 5.00541 4.99854 6.24805 4.99854H7.00391Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className={cn("menu-item-text", sidebarToggle ? "lg:hidden" : "")}>Content Management</span>

                  <svg
                    className={cn(
                      "menu-item-arrow",
                      selected === "CMS" ? "menu-item-arrow-active" : "menu-item-arrow-inactive",
                      sidebarToggle ? "lg:hidden" : ""
                    )}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39584L10.0001 12.6042L15.2084 7.39585"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                
                {/* Dropdown Menu Start */}
                <div
                  className={cn(
                    "overflow-hidden transform translate",
                    selected === "CMS" ? "block" : "hidden"
                  )}
                >
                  <ul className={cn("flex flex-col gap-1 mt-2 menu-dropdown pl-9", sidebarToggle ? "lg:hidden" : "flex")}>
                    <li>
                      <Link href={route('admin.sliders.index')}
                        className={cn(
                          "menu-dropdown-item group",
                          ["sliders", "slider-create", "slider-edit"].includes(page)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        )}
                      >
                        Sliders
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Dropdown Menu End */}
              </li>
              {/* Menu Item CMS */}

              {/* Menu Item Contact */}
              <li>
                <Link href={route('admin.contact')}
                  onClick={() => setSelected((prev) => (prev === "Contacts" ? "" : "Contacts"))}
                  className={cn(
                    "menu-item group",
                    selected === "Contacts" && page === "contacts"
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  )}
                >
                  <svg
                    className={cn(
                      selected === "Contacts" && page === "contacts"
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    )}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H18.5001C19.7427 20.75 20.7501 19.7426 20.7501 18.5V5.5C20.7501 4.25736 19.7427 3.25 18.5001 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H18.5001C18.9143 4.75 19.2501 5.08579 19.2501 5.5V18.5C19.2501 18.9142 18.9143 19.25 18.5001 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V5.5ZM6.25005 9.7143C6.25005 9.30008 6.58583 8.9643 7.00005 8.9643L17 8.96429C17.4143 8.96429 17.75 9.30008 17.75 9.71429C17.75 10.1285 17.4143 10.4643 17 10.4643L7.00005 10.4643C6.58583 10.4643 6.25005 10.1285 6.25005 9.7143ZM6.25005 14.2857C6.25005 13.8715 6.58583 13.5357 7.00005 13.5357H17C17.4143 13.5357 17.75 13.8715 17.75 14.2857C17.75 14.6999 17.4143 15.0357 17 15.0357H7.00005C6.58583 15.0357 6.25005 14.6999 6.25005 14.2857Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className={cn("menu-item-text", sidebarToggle ? "lg:hidden" : "")}>Contact Message</span>
                </Link>
              </li>
              {/* Menu Item Calendar */}
            </ul>
          </div>
        </nav>
        {/* Sidebar Menu */}
      </div>
    </aside>
  );
}
