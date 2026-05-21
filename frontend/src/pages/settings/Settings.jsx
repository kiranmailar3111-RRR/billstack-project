import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  BadgeIndianRupee,
  Image,
  PenLine,
  Save,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    business_name: "",
    gst_number: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    signature: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const imageBaseUrl = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    fetchSettings();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("blob:") || image.startsWith("http")) {
      return image;
    }

    return `${imageBaseUrl}${image}`;
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");

      if (response.data.data) {
        const data = response.data.data;

        setSettings({
          business_name: data.business_name || "",
          gst_number: data.gst_number || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          logo: data.logo || "",
          signature: data.signature || "",
        });

        setLogoPreview(getImageUrl(data.logo));
        setSignaturePreview(getImageUrl(data.signature));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch settings");
    }
  };

  const showToast = (message) => {
    setToast({
      show: true,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 2500);
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) return;

    if (fieldName === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }

    if (fieldName === "signature") {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const payload = new FormData();

    payload.append("business_name", settings.business_name || "");
    payload.append("gst_number", settings.gst_number || "");
    payload.append("email", settings.email || "");
    payload.append("phone", settings.phone || "");
    payload.append("address", settings.address || "");

    if (logoFile) {
      payload.append("logo", logoFile);
    }

    if (signatureFile) {
      payload.append("signature", signatureFile);
    }

    try {
      await api.post("/settings", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchSettings();

      setLogoFile(null);
      setSignatureFile(null);

      showToast("Settings saved successfully");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to save settings");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Business Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Configure your company profile, GST details, logo and invoice
            signature.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold transition shadow-lg shadow-blue-200"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
        <div className="2xl:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Building2 className="text-blue-600" size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Business Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  This information appears on invoices and reports.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Building2 size={18} />
                  Business Name
                </label>

                <input
                  type="text"
                  name="business_name"
                  value={settings.business_name}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <BadgeIndianRupee size={18} />
                  GST Number
                </label>

                <input
                  type="text"
                  name="gst_number"
                  value={settings.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail size={18} />
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone size={18} />
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={18} />
                  Business Address
                </label>

                <textarea
                  rows="4"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  placeholder="Enter business address"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <Image className="text-green-600" size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Branding Assets
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Upload logo and authorized signature for invoices.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-6 bg-slate-50">
                <div className="flex items-center gap-3 mb-5">
                  <UploadCloud className="text-blue-600" size={22} />
                  <h3 className="font-bold text-slate-900">Business Logo</h3>
                </div>

                <div className="w-full h-52 rounded-[24px] bg-white border border-slate-200 overflow-hidden flex items-center justify-center mb-5">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="text-slate-400" size={60} />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-6 bg-slate-50">
                <div className="flex items-center gap-3 mb-5">
                  <PenLine className="text-green-600" size={22} />
                  <h3 className="font-bold text-slate-900">Signature</h3>
                </div>

                <div className="w-full h-52 rounded-[24px] bg-white border border-slate-200 overflow-hidden flex items-center justify-center mb-5">
                  {signaturePreview ? (
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <PenLine className="text-slate-400" size={60} />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "signature")}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-950 to-slate-800 rounded-[32px] p-6 text-white h-fit sticky top-28 shadow-xl">
          <p className="text-slate-400 text-sm">Invoice Identity Preview</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-[24px] bg-white/10 overflow-hidden flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="text-slate-300" size={38} />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {settings.business_name || "Your Business"}
              </h3>
              <p className="text-slate-400 text-sm">GST Invoice</p>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm">
            <div>
              <p className="text-slate-400">GST Number</p>
              <p className="font-semibold mt-1">
                {settings.gst_number || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-semibold mt-1">{settings.email || "-"}</p>
            </div>

            <div>
              <p className="text-slate-400">Phone</p>
              <p className="font-semibold mt-1">{settings.phone || "-"}</p>
            </div>

            <div>
              <p className="text-slate-400">Address</p>
              <p className="font-semibold mt-1">
                {settings.address || "-"}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-slate-400 text-sm mb-3">
              Authorized Signature
            </p>

            <div className="h-28 rounded-[24px] bg-white/10 flex items-center justify-center overflow-hidden">
              {signaturePreview ? (
                <img
                  src={signaturePreview}
                  alt="Signature"
                  className="w-full h-full object-contain"
                />
              ) : (
                <PenLine className="text-slate-300" size={42} />
              )}
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[100]">
          <CheckCircle2 size={22} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Settings;