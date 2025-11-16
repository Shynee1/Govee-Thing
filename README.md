# Govee Thing

A DeskThing app for controlling Govee smart lights via Bluetooth and LAN (Wi-Fi) connections.

## Features

- 🔵 **Bluetooth Support** - Control Govee devices via BLE (Web Bluetooth API)
- 🌐 **LAN Support** - Control Wi-Fi enabled Govee devices over your local network
- 🎨 **Color Control** - Interactive color wheel and preset colors
- 💡 **Brightness Control** - Smooth brightness adjustment (0-100%)
- 🌡️ **Color Temperature** - Adjust warmth from 2700K (warm) to 6500K (cool)
- 🔌 **Power Control** - Turn lights on/off
- 📱 **Multi-Device** - Connect and control multiple devices simultaneously
- 🎯 **Unified Interface** - Same controls work for both Bluetooth and LAN devices

## Installation

1. Download the latest release from the [Releases](https://github.com/Shynee1/Govee-Thing/releases) page
2. Install the app through DeskThing
3. Launch Govee Thing from your DeskThing dashboard

## Usage

### Scanning for Devices

**Bluetooth Devices:**
- Click the "Scan" button on the scan screen
- A browser dialog will appear showing available Bluetooth devices
- Select your Govee device from the list
- The device will appear in the device list

**LAN Devices:**
- Ensure your Govee device is connected to Wi-Fi
- Enable "LAN Control" in the Govee Home app (Device Settings)
- Click the "Scan" button
- LAN devices will automatically appear in the device list

### Connecting to Devices

1. Select one or more devices from the scan screen
2. Click the "Connect" button
3. Wait for the connection to establish
4. You'll be taken to the control screen

### Controlling Devices

- **Color Wheel**: Drag to select any color
- **Preset Colors**: Quick access to common colors (red, green, blue, yellow, purple, white)
- **Brightness Slider**: Adjust light intensity
- **Color Temperature Slider**: Change from warm (orange) to cool (blue) white light
- **Power Button**: Toggle lights on/off (top right)
- **Back Button**: Disconnect and return to scan screen (top left)

## Supported Devices

### Bluetooth Devices
All Govee devices with Bluetooth connectivity are supported, including:
- Devices with model prefix `Govee_`
- Devices with model prefix `ihoment_`

Common Bluetooth models include:
- H6199, H6182, H6104, H6109, H6110
- H6127, H6141, H6142, H6143, H6144, H6148
- H6159, H6163, H6188, H6195
- And many more Govee Bluetooth-enabled devices

### LAN (Wi-Fi) Devices

#### Wall Lights & Panels
- **H6062** - Govee Glide Wall Light
- **H6063** - Govee Gaming Wall Light
- **H6065** - Govee Glide Y Lights
- **H6066** - Govee Glide Hexa Pro Light Panels
- **H6067** - Govee Glide Tri Light Panels
- **H606A** - Govee Glide Hexa Light Panel Ultra
- **H6088** - Govee RGBIC Cube Wall Sconces
- **H610A** - Govee Glide Lively Wall Light
- **H610B** - Govee Glide Music Wall Light

#### LED Strip Lights
- **H6110** - 2×5m MultiColor with Alexa
- **H6159** - 5m MultiColor with Alexa
- **H615A** - 5m RGB Strip Light with Alexa
- **H615B** - 10m RGB Strip Light with Alexa
- **H615C** - 15m RGB Strip Light with Alexa
- **H615D** - 20m RGB Strip Light with Alexa
- **H615E** - 30m RGB Strip Light with Alexa
- **H6172** - 10m Outdoor RGBIC LED Strip Lights
- **H6173** - 2×10m Outdoor RGBIC LED Strip Lights
- **H6175** - 10m RGBIC Outdoor Strip Lights
- **H6176** - 30m RGBIC Outdoor Strip Lights
- **H618A** - 5m RGBIC Basic Strip Lights with Alexa
- **H618C** - 10m RGBIC Basic Strip Lights with Alexa
- **H618E** - 2×10m RGBIC Strip Lights with Alexa
- **H618F** - 2×15m RGBIC LED Strip Light With Alexa
- **H619A** - 5m RGBIC Pro Strip Lights with Alexa
- **H619B** - 7.5m RGBIC Pro Strip Lights with Alexa
- **H619C** - 10m RGBIC Pro Strip Lights with Alexa
- **H619D** - 2×7.5m RGBIC Pro Strip Lights with Alexa
- **H619E** - 2×10m RGBIC Pro Strip Lights with Alexa
- **H619Z** - 3m RGBIC Pro Strip Lights with Alexa
- **H61BA** - 5m RGBICW LED Strip Light
- **H61BC** - 10m RGBICW LED Strip Light
- **H61BE** - 2×10m RGBICW LED Strip Light
- **H61B1** - 5m RGBICW LED Strip Light with cover
- **H61E0** - Govee LED Strip Light M1
- **H61E1** - Govee LED Strip Light M1
- **H616C** - 10m RGBIC Outdoor Strip Lights 2
- **H616D** - 2×7.5m RGBIC Outdoor Strip Lights 2
- **H616E** - 2×10m RGBIC Outdoor Strip Lights 2

#### Neon Rope Lights
- **H61A0** - 3m RGBIC LED Neon Rope Lights
- **H61A1** - 2m RGBIC LED Neon Rope Lights
- **H61A2** - 5m RGBIC LED Neon Rope Lights
- **H61A3** - 4m RGBIC LED Neon Rope Lights
- **H61A5** - 10m RGBIC LED Neon Rope Lights
- **H61A8** - 10m RGBIC Outdoor Neon Rope Light
- **H61A9** - 20m RGBIC Outdoor Neon Rope Light
- **H61C2** - 2m RGBIC Neon Rope Light for desks
- **H61C3** - 3m RGBIC Neon Rope Light for gaming desk

#### TV Backlights & Light Bars
- **H6042** - Govee TV Light Bar 2
- **H6043** - Govee TV Light Bars 2
- **H6046** - Govee RGBIC TV Light Bars
- **H6047** - Govee RGBIC Gaming Light Bars
- **H6056** - Govee RGBICWW Light Bars
- **H6167** - 2.4m RGBIC TV Backlight
- **H6168** - 2×0.7m+2×1.2m RGBIC TV Backlight
- **H6182** - Wi-Fi MultiColor TV Strip Light
- **H61B2** - 3m RGBIC Neon TV Backlight

#### Floor Lamps
- **H6072** - Govee RGBICWW Floor Lamp
- **H6076** - Govee Floor Lamp (H6076A)
- **H6078** - Govee RGBICWW Cylinder Floor Lamp
- **H607C** - Govee RGBICWW Floor Lamp 2
- **H60B0** - Govee Uplighter Floor Lamp
- **H60B1** - Govee Torchiere Floor Lamp

#### Ceiling & Fixture Lights
- **H6087** - Govee RGBIC Fixture Lights
- **H608A** - 5m String Downlights
- **H608B** - 3m String Downlights
- **H608C** - 2m String Downlights
- **H608D** - 10m String Downlights
- **H60A0** - 12inch Ceiling Light

#### Outdoor Lights
- **H7028** - LED Bulb String Lights
- **H7033** - LED Bulb String Lights
- **H7052** - 15m Outdoor Ground Lights
- **H7053** - 30m Outdoor Ground Lights
- **H7055** - Govee RGBIC Path Lights
- **H705A** - 30m Permanent Outdoor Lights
- **H705B** - 15m Permanent Outdoor Lights
- **H705C** - 45m Permanent Outdoor Lights
- **H705D** - 15m Permanent Outdoor Lights 2
- **H705E** - 30m Permanent Outdoor Lights 2
- **H705F** - 45m Permanent Outdoor Lights 2
- **H7060** - Govee RGBIC Flood lights
- **H7061** - 2 Pack RGBIC Flood Lights
- **H7062** - 6 Pack RGBIC Flood Lights
- **H7063** - Govee Outdoor Flood Light
- **H7065** - Govee RGBIC Spotlights
- **H7066** - Govee RGBIC Spotlights
- **H706A** - 30m Permanent Outdoor Lights Pro
- **H706B** - 45m Permanent Outdoor Lights Pro
- **H706C** - 60m Permanent Outdoor Lights Pro
- **H7075** - Govee Outdoor Wall light
- **H70C1** - 10m RGBIC String Light
- **H70C2** - 20m RGBIC String Light
- **H805A** - 30m Permanent Outdoor Lights Elite
- **H805B** - 15m Permanent Outdoor Lights Elite
- **H805C** - 45m Permanent Outdoor Lights Elite

> **Note**: LAN devices require the "LAN Control" feature to be enabled in the Govee Home app. If you don't see the LAN switch, disconnect the device from power, wait 30 minutes, and check again.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Credits

Built for [DeskThing](https://deskthing.app) by [Shynee1](https://github.com/Shynee1)

## Support

For issues, questions, or feature requests, please open an issue on [GitHub](https://github.com/Shynee1/Govee-Thing/issues).