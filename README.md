# Speech to text webapp using Whisper 

This is very experimental web app  for speech transcription, I intended to create a scalable saas service that would provide high performance speech to text, currently state of this project is just quick prototype to test the concept.

Currently this uses nodejs sever with express to handle routes, and invoke external whisper.cpp binary using spawn child processes, I think currently this is very inefficient approach, Either  I am thinking of using proper js binding or wasm approach, But idk, just brainstorming. 
 
