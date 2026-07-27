<div class="col-span-full">
    {{-- Bungkus dengan div scrollable agar mobile friendly --}}
    <div style="overflow-x: auto; width: 100%;">
        <div style="min-width: 600px; height: 600px;">
            @include('filament-widgets::chart-widget')
        </div>
    </div>
    
    <x-filament-actions::modals />
</div>