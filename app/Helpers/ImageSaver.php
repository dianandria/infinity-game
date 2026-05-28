<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
// use Intervention\Image\Drivers\Gd\Driver; // atau Imagick\Driver jika pakai Imagick
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class ImageSaver
{
    public static function storeCompressed(\Illuminate\Http\UploadedFile $file, int $productId, string $format='webp', int $maxWidth=1800, int $quality=82): string
    {
        $manager = new ImageManager(new Driver()); // ganti ke new \Intervention\Image\Drivers\Imagick\Driver() jika pakai Imagick
        $image = $manager->read($file->getRealPath());

        // Resize downscale (jaga rasio)
        if ($image->width() > $maxWidth) {
            $image = $image->scaleDown(width: $maxWidth);
        }

        // Encode → webp/avif/jpeg
        $encoded = match ($format) {
            'avif' => $image->toAvif(quality: $quality),
            'jpg','jpeg' => $image->toJpeg(quality: $quality),
            default => $image->toWebp(quality: $quality),
        };

        // Path simpan (public disk)
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safe = \Str::slug($name);
        $filename = $safe.'-'.\Str::random(6).'.'.$format;
        $path = "products/{$productId}/".$filename;

        Storage::disk('public')->put($path, (string) $encoded);

        // Optional lossless optimize (jpegoptim/pngquant/… harus terinstall di OS)
        if (class_exists(ImageOptimizer::class)) {
            $abs = Storage::disk('public')->path($path);
            try { ImageOptimizer::optimize($abs); } catch (\Throwable $e) { /* ignore */ }
        }

        return $path; // simpan ke DB
    }

    // Versi multi-ukuran (thumbnail, medium, large) – opsional
    public static function storeVariants(\Illuminate\Http\UploadedFile $file, int $productId, string $format='webp', int $quality=82): array
    {
        $sizes = [
            'lg' => 1800,
            'md' => 1200,
            'sm' => 600,
        ];
        $paths = [];
        foreach ($sizes as $key => $w) {
            $paths[$key] = self::storeCompressed($file, $productId, $format, $w, $quality);
        }
        return $paths;
    }
}
