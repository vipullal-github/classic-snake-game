"# classic-snake-game" 

This is my take on the classic Snake game. It is written using Javascript and Cordova. I have tested it on Android. Feel free to port to iOS.

Tools required:
-   Cordova 
-   Java-8 SDK (Required by Cordova)
-   Android SDK with an Android emulators setup.

To Debug using Chrome:
- In the MainActivity.java add:
    import android.webkit.WebView;
 - and in onCreate:
    WebView.setWebContentsDebuggingEnabled(true);
- Then check the device by pointing Chrome to chrome://inspect/#devices

To build on your machine Windows or Mac:

1.  Clone the repository
2.  cordova run --emulator

Enjoy!
