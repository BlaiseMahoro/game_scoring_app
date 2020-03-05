const Observable = require("tns-core-modules/data/observable").Observable;
const frame = require("tns-core-modules/ui/frame");
var data =[]
var or_data=[]

function createViewModel(page){
    const viewModel = new Observable();
    const context = page.navigationContext;
    or_data =context.data
    data = context.data
    const rounds = context.rounds
    var max = rounds;

    console.log('context',context)
  
    viewModel.set('data', data)
    viewModel.set('rounds', rounds)
    viewModel.set('err_msg','')
    var max = 1;
    var min = 1;
    viewModel.set('min', min)
    viewModel.set('max', max)
  viewModel.onMaxSliderLoaded=(argsloaded)=>{
    const sliderComponent = argsloaded.object;
    sliderComponent.on("valueChange", (args) => {
        const slider = args.object;
        console.log(`Slider new value ${slider.value}`);
        max =slider.value
        viewModel.set('max', max)
      
    });
  }
  viewModel.onMinSliderLoaded=(argsloaded)=>{
    const sliderComponent = argsloaded.object;
    sliderComponent.on("valueChange", (args) => {
        const slider = args.object;
        console.log(`Slider new value ${slider.value}`);
        min = slider.value
        viewModel.set('min', min)
        
    });
  }
  viewModel.onApply=()=>{
    if(min>max){
      viewModel.set('err_msg','Min must be less than or equal to max.')
      return
    }
    viewModel.set('err_msg','')
    var items=[]
    for (let i =0; i<=data.length-1; i++){
      if(data[i].round<min || data[i].round >max)
        continue
      items.push(data[i])
    }
    viewModel.set('data', items)
  }
  viewModel.onBack=()=>{
    frame.goBack();
  }

    return viewModel;
}


exports.createViewModel = createViewModel;