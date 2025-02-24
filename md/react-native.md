# React Native Setup

## Boring and heavy way for all OSes

Go to https://reactnative.dev/docs/environment-setup click in "React Native CLI Quickstart" and follow instructions.

If you don't want to fill your system with the full android studio or XCode follow the instructions below but be aware that there are dragons ahead!

## Android

```bash
brew install --cask adoptopenjdk/openjdk/adoptopenjdk8
export ANDROID_SDK_ROOT="~/android-sdk"
touch ~/.android/repositories.cfg
```

Download `cmdline-tool` from [https://developer.android.com/studio#cmdline-tools](https://developer.android.com/studio#cmdline-tools) and extract to `~/android-sdk/cmdline-tools/latest`

```bash

~/android-sdk/cmdline-tools/latest/bin/sdkmanager --update
~/android-sdk/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-29" "build-tools;29.0.2" "system-images;android-29;default;x86_64"

// in your .zshrc or similar add sdk to PATH
PATH=$PATH:$ANDROID_SDK_ROOT/emulator
PATH=$PATH:$ANDROID_SDK_ROOT/tools
PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH
```
Now all the tools are in the `$PATH` , no need for absolute paths anymore.

### Some examples

You normally don't need to run any of these

```bash
# install new platforms, build tools and system images
sdkmanager --update
sdkmanager "platforms;android-29" "build-tools;29.0.2" "system-images;android-29;default;x86_64"

# create an avd
avdmanager create avd -n aegir-android -d pixel --package "system-images;android-29;default;x86_64"

# delete avd
avdmanager delete avd -n aegir-android

# manually run the emulator
emulator @aegir-android

# list avds
emulator -list-avds

# redirect port traffic
adb -s emulator-5554 reverse tcp:3000 tcp:3000
adb reverse --list
adb reverse --remove-all
```
> If the internal aegir AVD changes SDK versions you might need to run the `sdkmanager` above to update and install the new SDK versions in your system.


### emulator acceleration (optional)

[https://developer.android.com/studio/run/emulator-acceleration#vm-mac](https://developer.android.com/studio/run/emulator-acceleration#vm-mac)

### Aegir config
Android needs special attention for networks settings ([docs](https://developer.android.com/studio/run/emulator-networking)). The most common change is to use the special address `10.0.2.2` to redirect trafic to your local loopback interface `127.0.0.1`.

```js
module.exports = {
  test: {
    async before (options) {
      let echoServer = new EchoServer()
      await echoServer.start()
      const { address, port } = echoServer.server.address()
      let hostname = address // address will normally be 127.0.0.1

      if(options.runner === 'react-native-android') {
        hostname = '10.0.2.2'
      }

      return {
        echoServer,
        env: { ECHO_SERVER : format({ protocol: 'http:', hostname, port })}
      }
    },
    async after (options, before) {
      await before.echoServer.stop()
    }
  }
}


```