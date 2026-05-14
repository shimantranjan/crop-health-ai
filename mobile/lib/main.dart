import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CameraScannerScreen extends StatefulWidget {
  final List<CameraDescription> cameras;
  
  CameraScannerScreen({required this.cameras});

  @override
  _CameraScannerScreenState createState() => _CameraScannerScreenState();
}

class _CameraScannerScreenState extends State<CameraScannerScreen> {
  late CameraController _controller;
  bool isDetecting = false;
  String result = "Scanning...";

  @override
  void initState() {
    super.initState();
    // Initialize standard back camera
    _controller = CameraController(widget.cameras[0], ResolutionPreset.medium);
    _controller.initialize().then((_) {
      if (!mounted) return;
      
      // Start Image Stream for Real-time Inference
      _controller.startImageStream((CameraImage image) {
        if (!isDetecting) {
          isDetecting = true;
          // In real implementation: Convert CameraImage to bytes and send to API API or run local TFLite
          // Here's the mocked logic flow:
          processFrame(image);
        }
      });
      setState(() {});
    });
  }

  Future<void> processFrame(CameraImage image) async {
    try {
      // Logic to convert CameraImage to Jpeg format and HTTP POST would go here
      // This requires manual plane conversion in Dart. For now, simulate delay:
      await Future.delayed(Duration(milliseconds: 500));
      
      setState(() {
        result = "Disease: Healthy (Mocked 95%)";
      });
    } finally {
      isDetecting = false;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_controller.value.isInitialized) {
      return Container();
    }
    return Scaffold(
      appBar: AppBar(title: Text('Crop Scanner')),
      body: Stack(
        children: [
          CameraPreview(_controller),
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black87,
                borderRadius: BorderRadius.circular(12)
              ),
              child: Text(
                result,
                style: TextStyle(color: Colors.white, fontSize: 18),
                textAlign: TextAlign.center,
              ),
            )
          )
        ],
      )
    );
  }
}
