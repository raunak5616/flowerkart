import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="bg-shell px-4 py-16 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="surface-card rounded-[40px] bg-white p-8 text-center md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
            Need to get in touch with FlowerKart?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            This page was previously just a placeholder. For now, support is routed into the improved help center until a dedicated contact experience is built out.
          </p>
          <Link to="/support" className="cta-button mt-8 inline-flex px-6 py-3 text-sm">
            Visit support center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
