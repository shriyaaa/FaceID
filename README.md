# FACEID_CURRENT
FaceID is a face recognition attendance system that uses Google Calendar to schedule events. EJS is used as the templating language and it runs on node.js using Javascript. Backend of the program uses MySQL to store information about individuals.
The face recognition part makes use of face-api.js, a javascript module implementing convolutional neural networks to detect and recognize faces and display face landmarks in the browser. Face-api.js is a javascript API implemented on top of the tensorflow.js core API, tensorflow/tfjs-core.
Google Calendar API is used in FaceID to get events from a user’s Google Calendar and extract date, time and name from the events users set in their calendar. 
