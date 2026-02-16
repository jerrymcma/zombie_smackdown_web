package com.example.zombiesmackdown

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val myWebView: WebView = findViewById(R.id.webview)
        val webSettings: WebSettings = myWebView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.useWideViewPort = true
        webSettings.loadWithOverviewMode = true

        myWebView.webViewClient = WebViewClient()
        
        // Toggle this to switch between local development and production build
        val isDevelopment = true
        
        if (isDevelopment) {
            // Point to the live Vercel deployment for testing
            myWebView.loadUrl("https://zombie-smackdown-web.vercel.app/")
        } else {
            // Point to the bundled assets in app/src/main/assets/dist
            // Make sure to run 'npm run build' and move/link the 'dist' folder contents to assets
            myWebView.loadUrl("file:///android_asset/dist/index.html")
        }
    }
}