package com.example.agent

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.graphics.Rect
import android.os.Build
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import androidx.core.app.NotificationCompat
import org.json.JSONObject

class AccessibilityService : AccessibilityService() {

    private lateinit var webSocketClient: WebSocketClient
    private val deviceId = "android-device-001" // Should be unique per device
    private val apiKey = "your-api-key" // Should be generated per device

    override fun onCreate() {
        super.onCreate()
        webSocketClient = WebSocketClient("ws://your-backend-url:8000/ws/device/$deviceId?api_key=$apiKey")
        webSocketClient.connect()
        startForegroundService()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event?.let {
            val eventData = JSONObject().apply {
                put("device_id", deviceId)
                put("timestamp", System.currentTimeMillis())
                put("package_name", it.packageName?.toString() ?: "")
                put("event_type", getEventTypeString(it.eventType))
                put("text", it.text?.joinToString(" ") ?: "")
                put("view_id", it.source?.viewIdResourceName ?: "")

                val bounds = Rect()
                it.source?.getBoundsInScreen(bounds)
                put("bounds", JSONObject().apply {
                    put("l", bounds.left)
                    put("t", bounds.top)
                    put("r", bounds.right)
                    put("b", bounds.bottom)
                })
            }
            webSocketClient.sendMessage(eventData.toString())
        }
    }

    override fun onInterrupt() {
        Log.d("AccessibilityService", "Service interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocketClient.disconnect()
    }

    private fun getEventTypeString(eventType: Int): String {
        return when (eventType) {
            AccessibilityEvent.TYPE_VIEW_CLICKED -> "TYPE_VIEW_CLICKED"
            AccessibilityEvent.TYPE_VIEW_LONG_CLICKED -> "TYPE_VIEW_LONG_CLICKED"
            AccessibilityEvent.TYPE_VIEW_SCROLLED -> "TYPE_VIEW_SCROLLED"
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> "TYPE_WINDOW_STATE_CHANGED"
            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> "TYPE_VIEW_TEXT_CHANGED"
            else -> "UNKNOWN"
        }
    }

    private fun startForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "accessibility_channel",
                "Accessibility Service",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, "accessibility_channel")
            .setContentTitle("Accessibility Service")
            .setContentText("Running in background")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .build()

        startForeground(1, notification)
    }
}
