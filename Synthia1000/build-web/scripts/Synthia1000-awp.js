/* Declares the Synthia1000 Audio Worklet Processor */

class Synthia1000_AWP extends AudioWorkletGlobalScope.WAMProcessor
{
  constructor(options) {
    options = options || {}
    options.mod = AudioWorkletGlobalScope.WAM.Synthia1000;
    super(options);
  }
}

registerProcessor("Synthia1000", Synthia1000_AWP);
