import { User, Mail, Phone, Link2, Code2, MapPin } from "lucide-react";
import FormInput from "./FormInput";

export default function StepPersonal({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="Full Name"
          name="fullName"
          value={data.fullName}
          onChange={onChange}
          placeholder="John Doe"
          error={errors.fullName}
          required
          icon={User}
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          placeholder="john@example.com"
          error={errors.email}
          required
          icon={Mail}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={onChange}
          placeholder="+91 9876543210"
          error={errors.phone}
          required
          icon={Phone}
        />
        <FormInput
          label="Address"
          name="address"
          value={data.address}
          onChange={onChange}
          placeholder="City, State, Country"
          error={errors.address}
          icon={MapPin}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          value={data.linkedin}
          onChange={onChange}
          placeholder="https://linkedin.com/in/username"
          error={errors.linkedin}
          icon={Link2}
        />
        <FormInput
          label="GitHub URL"
          name="github"
          type="url"
          value={data.github}
          onChange={onChange}
          placeholder="https://github.com/username"
          error={errors.github}
          icon={Code2}
        />
      </div>
    </div>
  );
}
