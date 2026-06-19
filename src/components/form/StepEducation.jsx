import { BookOpen, Award, Star, Calendar } from "lucide-react";
import FormInput from "./FormInput";

export default function StepEducation({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="College / University Name"
          name="college"
          value={data.college}
          onChange={onChange}
          placeholder="MIT, IIT Delhi, etc."
          error={errors.college}
          required
          icon={BookOpen}
        />
        <FormInput
          label="Degree"
          name="degree"
          value={data.degree}
          onChange={onChange}
          placeholder="B.Tech, M.Tech, BCA…"
          error={errors.degree}
          required
          icon={Award}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormInput
          label="Specialization / Branch"
          name="specialization"
          value={data.specialization}
          onChange={onChange}
          placeholder="Computer Science, AI/ML…"
          error={errors.specialization}
          required
          icon={Star}
        />
        <FormInput
          label="CGPA / Percentage"
          name="cgpa"
          value={data.cgpa}
          onChange={onChange}
          placeholder="8.5 / 85%"
          error={errors.cgpa}
          icon={Star}
        />
      </div>

      <FormInput
        label="Graduation Year"
        name="year"
        type="number"
        value={data.year}
        onChange={onChange}
        placeholder="2024"
        error={errors.year}
        required
        icon={Calendar}
      />
    </div>
  );
}
