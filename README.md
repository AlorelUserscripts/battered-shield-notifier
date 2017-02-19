Tested in Tampermonkey (Chrome). Won't test on Firefox, but it should work there.

-----

[Install](https://raw.githubusercontent.com/AlorelUserscripts/battered-shield-notifier/master/battered-shield-helper.user.js)

-----

# Current functionality

- Notify when AP is above a given percentage
- Notify when HP is above a given percentage
- Notify on idling
- Notify on captcha
- Trigger events on the `document` when any Observable occurs - other script authors can use these as a kind of
framework for their own scripts

# Events

Every observable property can be listened on. A list of properties can be found by opening the console (F12 on Chrome),
clicking on the Tampermonkey extension icon, and selecting "Debug Battered Shield Helper":

![Screenshot](https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/ed05603312b6d888db85ffd8ec999faf5d4652d5/assets/debug-screenshot.jpg)

It should then produce an output such as this:

![Screenshot](https://cdn.rawgit.com/AlorelUserscripts/battered-shield-notifier/ed05603312b6d888db85ffd8ec999faf5d4652d5/assets/debug-output-screensho.jpg)

Any key under `observables` can be listened on, for example:

```js
document.addEventListener('battered-shield-helper.lvl_combat', e => {
    console.log(`I've reached combat level ${e.detail}!`);
});
document.addEventListener('battered-shield-helper.apPCT', e => {
    console.log(`My AP is now at ${e.detail}%!`);
});
```