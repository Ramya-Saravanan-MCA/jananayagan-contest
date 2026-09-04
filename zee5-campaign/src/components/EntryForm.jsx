import { useState } from "react";
import FileUpload from "./FileUpload";
import { supabase } from "../lib/supabase";

const EntryForm = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    gender: "",
    zee5Account: "",
    consent: false,
  });

  const GENDER_OPTIONS = ["male", "female", "prefer_not_to_say"];

  const checkDuplicate = async (field, value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return false;

    let query = supabase
      .from("giveaway_entries")
      .select("id")
      .limit(1);

    if (field === "mobile") {
      query = query.eq("mobile", trimmedValue);
    }

    if (field === "email") {
      query = query.eq("email", trimmedValue.toLowerCase());
    }

    if (field === "zee5Account") {
      query = query.eq("zee5_account", trimmedValue);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Duplicate check error:", error);
      return false;
    }

    return data && data.length > 0;
  };

  const handleChange = async (e) => {
    const { name, value, checked, type } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (type === "checkbox") {
      setErrors((prev) => ({
        ...prev,
        [name]: checked ? "" : "You must accept the terms and conditions.",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    if (name === "fullName") {
      if (!/^[A-Za-zÀ-ÿ\s.'-]{2,60}$/.test(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          fullName: "Please enter a valid name using letters only.",
        }));
      }

      return;
    }

    if (name === "mobile") {
      if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          mobile: "Enter a valid 10-digit mobile number.",
        }));

        return;
      }

      setChecking((prev) => ({
        ...prev,
        mobile: true,
      }));

      const exists = await checkDuplicate("mobile", trimmedValue);

      setChecking((prev) => ({
        ...prev,
        mobile: false,
      }));

      if (exists) {
        setErrors((prev) => ({
          ...prev,
          mobile: "This mobile number is already registered.",
        }));
      }

      return;
    }

    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          email: "Enter a valid email address.",
        }));

        return;
      }

      setChecking((prev) => ({
        ...prev,
        email: true,
      }));

      const exists = await checkDuplicate("email", trimmedValue.toLowerCase());

      setChecking((prev) => ({
        ...prev,
        email: false,
      }));

      if (exists) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
      }

      return;
    }

    if (name === "city") {
      if (!/^[A-Za-zÀ-ÿ\s.'-]{2,50}$/.test(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          city: "Enter a valid city.",
        }));
      }

      return;
    }

    if (name === "gender") {
      if (!GENDER_OPTIONS.includes(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          gender: "Please select your gender.",
        }));
      }

      return;
    }

    if (name === "zee5Account") {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedValue);
      const validMobile = /^[6-9]\d{9}$/.test(trimmedValue);

      if (!validEmail && !validMobile) {
        setErrors((prev) => ({
          ...prev,
          zee5Account: "Enter a valid ZEE5 registered mobile number or email.",
        }));

        return;
      }

      setChecking((prev) => ({
        ...prev,
        zee5Account: true,
      }));

      const exists = await checkDuplicate("zee5Account", trimmedValue);

      setChecking((prev) => ({
        ...prev,
        zee5Account: false,
      }));

      if (exists) {
        setErrors((prev) => ({
          ...prev,
          zee5Account: "This ZEE5 mobile number / email is already registered.",
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only JPG and PNG images are allowed.",
      }));

      setFile(null);
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "Image size must be less than 1MB.",
      }));

      setFile(null);
      return;
    }

    setErrors((prev) => ({
      ...prev,
      file: "",
    }));

    setFile(selectedFile);
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName.trim();
    const mobile = formData.mobile.trim();
    const email = formData.email.trim();
    const city = formData.city.trim();
    const gender = formData.gender;
    const zee5Account = formData.zee5Account.trim();

    if (!fullName) {
      newErrors.fullName = "Full name is required.";
    } else if (!/^[A-Za-zÀ-ÿ\s.'-]{2,60}$/.test(fullName)) {
      newErrors.fullName = "Please enter a valid name.";
    }

    if (!mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!city) {
      newErrors.city = "City is required.";
    } else if (!/^[A-Za-zÀ-ÿ\s.'-]{2,50}$/.test(city)) {
      newErrors.city = "Enter a valid city.";
    }

    if (!gender) {
      newErrors.gender = "Please select your gender.";
    } else if (!GENDER_OPTIONS.includes(gender)) {
      newErrors.gender = "Please select your gender.";
    }

    if (!zee5Account) {
      newErrors.zee5Account = "ZEE5 account is required.";
    } else {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(zee5Account);
      const validMobile = /^[6-9]\d{9}$/.test(zee5Account);

      if (!validEmail && !validMobile) {
        newErrors.zee5Account = "Enter a valid ZEE5 registered mobile number or email.";
      }
    }

    if (!file) {
      newErrors.file = "Please upload your screenshot.";
    }

    if (!formData.consent) {
      newErrors.consent = "You must accept the terms and conditions.";
    }

    if (errors.mobile) {
      newErrors.mobile = errors.mobile;
    }

    if (errors.email) {
      newErrors.email = errors.email;
    }

    if (errors.gender) {
      newErrors.gender = errors.gender;
    }

    if (errors.zee5Account) {
      newErrors.zee5Account = errors.zee5Account;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!validateForm()) {
      setTimeout(() => {
        const firstError = document.querySelector('[aria-invalid="true"]');

        firstError?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        firstError?.focus();
      }, 50);

      return;
    }

    setSubmitting(true);

    try {
      const mobile = formData.mobile.trim();
      const email = formData.email.trim().toLowerCase();
      const zee5Account = formData.zee5Account.trim();

      const [mobileExists, emailExists, zee5Exists] = await Promise.all([
        checkDuplicate("mobile", mobile),
        checkDuplicate("email", email),
        checkDuplicate("zee5Account", zee5Account),
      ]);

      const duplicateErrors = {};

      if (mobileExists) {
        duplicateErrors.mobile = "This mobile number is already registered.";
      }

      if (emailExists) {
        duplicateErrors.email = "This email is already registered.";
      }

      if (zee5Exists) {
        duplicateErrors.zee5Account = "This ZEE5 mobile number / email is already registered.";
      }

      if (Object.keys(duplicateErrors).length > 0) {
        setErrors((prev) => ({
          ...prev,
          ...duplicateErrors,
        }));

        setSubmitting(false);

        setTimeout(() => {
          const firstError = document.querySelector('[aria-invalid="true"]');

          firstError?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          firstError?.focus();
        }, 50);

        return;
      }

      if (!file) {
        setErrors((prev) => ({
          ...prev,
          file: "Please upload your screenshot.",
        }));

        setSubmitting(false);
        return;
      }

      const fileExtension = file.name.split(".").pop().toLowerCase();
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `entries/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("giveaway-screenshots")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("giveaway-screenshots")
        .getPublicUrl(filePath);

      const screenshotUrl = publicUrlData.publicUrl;
      const submittedGender = formData.gender;

      const { error: insertError } = await supabase.from("giveaway_entries").insert({
        full_name: formData.fullName.trim(),
        mobile: mobile,
        email: email,
        city: formData.city.trim(),
        gender: submittedGender,
        zee5_account: zee5Account,
        screenshot_url: screenshotUrl,
      });

      if (insertError) {
        await supabase.storage.from("giveaway-screenshots").remove([filePath]);
        throw new Error(insertError.message);
      }

      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        city: "",
        gender: "",
        zee5Account: "",
        consent: false,
      });

      setFile(null);
      setErrors({});

      if (onSuccess) {
        onSuccess(submittedGender);
      }
    } catch (error) {
      console.error("Submission error:", error);

      alert(error.message || "Something went wrong while submitting your entry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[760px] rounded-xl border border-purple-500/30 bg-[#070719]/90 p-5 shadow-[0_0_40px_rgba(124,58,237,0.10)]"
    >
      <div className="mb-4 flex items-center gap-3 border-b border-purple-500/20 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-400/60 bg-purple-500/10 text-sm text-purple-300">
          ♙
        </div>

        <div>
          <p className="text-[8px] tracking-[0.3em] text-purple-300">ENTER THE GIVEAWAY</p>
          <h2 className="text-sm font-bold">YOUR DETAILS</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <label className="mb-1 block text-[9px] text-gray-300">
            Full Name <span className="text-pink-400">*</span>
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            maxLength={60}
            required
            aria-invalid={!!errors.fullName}
            className={`h-9 w-full rounded-md border bg-[#08081b] px-3 text-[11px] text-white outline-none placeholder:text-gray-600 ${
              errors.fullName ? "border-red-500" : "border-purple-500/30 focus:border-pink-400"
            }`}
          />

          {errors.fullName && <p className="mt-1 text-[8px] text-red-400">{errors.fullName}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[9px] text-gray-300">
            Mobile Number <span className="text-pink-400">*</span>
          </label>

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            maxLength={10}
            inputMode="numeric"
            required
            aria-invalid={!!errors.mobile}
            className={`h-9 w-full rounded-md border bg-[#08081b] px-3 text-[11px] text-white outline-none placeholder:text-gray-600 ${
              errors.mobile ? "border-red-500" : "border-purple-500/30 focus:border-pink-400"
            }`}
          />

          {checking.mobile && <p className="mt-1 text-[8px] text-purple-300">Checking...</p>}
          {errors.mobile && <p className="mt-1 text-[8px] text-red-400">{errors.mobile}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[9px] text-gray-300">
            Email ID <span className="text-pink-400">*</span>
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            maxLength={100}
            required
            aria-invalid={!!errors.email}
            className={`h-9 w-full rounded-md border bg-[#08081b] px-3 text-[11px] text-white outline-none placeholder:text-gray-600 ${
              errors.email ? "border-red-500" : "border-purple-500/30 focus:border-pink-400"
            }`}
          />

          {checking.email && <p className="mt-1 text-[8px] text-purple-300">Checking...</p>}
          {errors.email && <p className="mt-1 text-[8px] text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[9px] text-gray-300">
            City <span className="text-pink-400">*</span>
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            maxLength={50}
            required
            aria-invalid={!!errors.city}
            className={`h-9 w-full rounded-md border bg-[#08081b] px-3 text-[11px] text-white outline-none placeholder:text-gray-600 ${
              errors.city ? "border-red-500" : "border-purple-500/30 focus:border-pink-400"
            }`}
          />

          {errors.city && <p className="mt-1 text-[8px] text-red-400">{errors.city}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[9px] text-gray-300">
            Gender <span className="text-pink-400">*</span>
          </label>

          <div className="relative">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              aria-invalid={!!errors.gender}
              className={`h-9 w-full appearance-none rounded-md border bg-[#08081b] px-3 pr-8 text-[11px] text-white outline-none ${
                errors.gender ? "border-red-500" : "border-purple-500/30 focus:border-pink-400"
              }`}
            >
              <option value="" disabled className="bg-[#08081b] text-gray-600">
                Select Gender
              </option>
              <option value="male" className="bg-[#08081b] text-white">
                Male
              </option>
              <option value="female" className="bg-[#08081b] text-white">
                Female
              </option>
              <option value="prefer_not_to_say" className="bg-[#08081b] text-white">
                Prefer not to say
              </option>
            </select>

            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {errors.gender && <p className="mt-1 text-[8px] text-red-400">{errors.gender}</p>}
        </div>
      </div>

      <div className="my-4">
        <div className="mb-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-purple-500/20" />
          <span className="text-[8px] font-bold tracking-[0.25em] text-purple-300">ZEE5 ACCOUNT</span>
          <span className="h-px flex-1 bg-purple-500/20" />
        </div>

        <label className="mb-1 block text-[9px] text-gray-300">
          ZEE5 Registered Mobile Number / Email
          <span className="text-pink-400"> *</span>
        </label>

        <div
          className={`flex h-9 overflow-hidden rounded-md border bg-[#08081b] ${
            errors.zee5Account ? "border-red-500" : "border-purple-500/30"
          }`}
        >
          <div className="flex w-12 items-center justify-center bg-white text-[7px] font-black text-black">
            ZEE5
          </div>

          <input
            type="text"
            name="zee5Account"
            value={formData.zee5Account}
            onChange={handleChange}
            placeholder="Mobile number or email linked to your ZEE5 account"
            maxLength={100}
            required
            aria-invalid={!!errors.zee5Account}
            className="w-full bg-transparent px-3 text-[11px] text-white outline-none placeholder:text-gray-600"
          />
        </div>

        {checking.zee5Account && <p className="mt-1 text-[8px] text-purple-300">Checking...</p>}
        {errors.zee5Account && <p className="mt-1 text-[8px] text-red-400">{errors.zee5Account}</p>}
      </div>

      <FileUpload file={file} onChange={handleFileChange} />

      {errors.file && <p className="mt-1 text-[8px] text-red-400">{errors.file}</p>}

      <div className="mt-3 grid grid-cols-[16px_1fr] items-start gap-2">
  <input
    type="checkbox"
    name="consent"
    checked={formData.consent}
    onChange={handleChange}
    required
    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-pink-500"
  />

  <div className="min-w-0">
    <label className="block text-[9px] leading-4 text-gray-400">
      I confirm that I have watched Jana Nayagan on ZEE5 and the information submitted above is
      correct. I agree to the{" "}
      <a
        href="/terms-and-conditions"
        className="text-purple-300 underline transition-colors hover:text-pink-400"
      >
        Terms & Conditions
      </a>
      .
    </label>

    {errors.consent && (
      <p className="mt-1 text-[8px] text-red-400">
        {errors.consent}
      </p>
    )}
  </div>
</div>

      <button
        type="submit"
        disabled={submitting}
        className={`group mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-md bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-600 text-[10px] font-bold tracking-[0.2em] text-white transition-all duration-300 ${
          submitting
            ? "cursor-not-allowed opacity-60"
            : "hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(236,72,153,0.45)] active:translate-y-0 active:scale-[0.99]"
        }`}
      >
        {submitting ? "SUBMITTING..." : "SUBMIT & ENTER GIVEAWAY"}

        {!submitting && (
          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
        )}
      </button>
    </form>
  );
};

export default EntryForm;