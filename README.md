# React + Vite

## Delivery Process

```mermaid
flowchart TD
	customer[Customer opens Andiamo's website]
	menu[Customer selects menu items]
	checkout[Customer submits an order for delivery]
	restaurant[Restaurant receives the delivery order]
	manager[Manager opens Delivery Manager]
	create[Manager creates delivery: price, customer phone, optional address and driver note]
	database[(Supabase deliveries table)]
	assign[Manager assigns an active driver]
	link[Manager sends customer tracking link through WhatsApp]
	track[Customer opens tracking page]
	agent[Driver signs in to Delivery Agent]
	take[Driver selects Take]
	delivered[Driver selects Mark delivered]
	complete[Customer tracking page shows Delivered]

	customer --> menu --> checkout --> restaurant --> manager --> create --> assign --> database
	create --> link --> track
	database --> agent --> take --> database
	database --> track
	take --> delivered --> database --> complete
```

The manager can create and deactivate driver accounts. Each delivery is assigned to one driver, who can take and complete only their own deliveries. The public tracking page exposes only the order status and price.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
