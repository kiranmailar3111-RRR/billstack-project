<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show()
    {
        $setting = Setting::first();

        return response()->json([
            'status' => true,
            'data' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'business_name' => 'nullable|string|max:255',
            'gst_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'signature' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create([]);
        }

        $logoPath = $setting->logo;
        $signaturePath = $setting->signature;

        if ($request->hasFile('logo')) {
            if ($setting->logo) {
                Storage::disk('public')->delete($setting->logo);
            }

            $logoPath = $request->file('logo')->store('settings', 'public');
        }

        if ($request->hasFile('signature')) {
            if ($setting->signature) {
                Storage::disk('public')->delete($setting->signature);
            }

            $signaturePath = $request->file('signature')->store('settings', 'public');
        }

        $setting->update([
            'business_name' => $request->business_name,
            'gst_number' => $request->gst_number,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'logo' => $logoPath,
            'signature' => $signaturePath,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Settings updated successfully',
            'data' => $setting,
        ]);
    }

    public function imageBase64(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->path;

        if (!Storage::disk('public')->exists($path)) {
            return response()->json([
                'status' => false,
                'data' => null,
            ], 404);
        }

        $file = Storage::disk('public')->get($path);

        $mime = Storage::disk('public')->mimeType($path);

        return response()->json([
            'status' => true,
            'data' => 'data:' . $mime . ';base64,' . base64_encode($file),
        ]);
    }
}