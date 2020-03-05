const Observable = require("tns-core-modules/data/observable").Observable;
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const frame = require("tns-core-modules/ui/frame");
const TextField = require("tns-core-modules/ui/text-field").TextField;
const StackLayout = require("tns-core-modules/ui/layouts/stack-layout")
    .StackLayout;
const Label = require("tns-core-modules/ui/label").Label;
var num_pl = 0;
var names = [];
const dialogs = require("tns-core-modules/ui/dialogs");
const  ScrollView=require("tns-core-modules/ui/scroll-view").ScrollView
const Button= require("tns-core-modules/ui/button").Button
var round_num = 0;
var totals =[]
var items_chart = new ObservableArray([])
function update() {
    const page = frame.topmost().currentPage;
    while(totals.length>0)
        totals.pop()
   
    for (let i = 1; i <= num_pl; i++) {
        var total = 0;
        for (let j = 1; j <= round_num; j++) {
            let text_tmp = getViewById(page, j + "" + i).text;
            var num_tmp = Number.isNaN(parseInt(text_tmp))
                ? 0
                : parseInt(text_tmp);
            total += num_tmp;
        }
        let textField = getViewById(page, "tot" + i);

        textField.text = total + "";
        totals.push(total);
    }
    

    //console.log('items',items_chart)
}
function resetRounds() {
    round_num = 0;
    const page = frame.topmost().currentPage;
    const stack_3 = getViewById(page, "stack-3");
    stack_3.removeChildren();
    var stackLayout = new StackLayout();

    stackLayout.orientation = "horizontal";
    for (let i = 1; i <= num_pl; i++) {
        //Add name labels at the top
        //names.push(temp_text);
        let label = new Label();
        label.text = names[i-1];
        label.textWrap = true;
        stackLayout.addChild(label);
    }

    stack_3.addChild(stackLayout);

    update();
}
 
function startFromScratch() {
    num_pl = 0;
    round_num = 0;
    const page = frame.topmost().currentPage;
    const grid = getViewById(page, "grid-1");
    grid.visibility = "visible";
    const stack2 = getViewById(page, "stack-2");
    const stack_tot = getViewById(page, "tot-stack");
    const stack1 = getViewById(page, "stack-1");
    stack2.visibility = "collapsed";
    stack_tot.visibility = "collapsed";
    stack1.visibility = "collapsed";
    const stack = getViewById(page, "stack-0");
    stack.removeChildren();
    const stack_3 = getViewById(page, "stack-3");
    stack_3.removeChildren();
    stack_tot.removeChild(getViewById(page, "tot"));
    const show_comm= getViewById(page,"show_comm")
    console.log(show_comm)
    const comm_stack=getViewById(page,"comm_stck")
    console.log(comm_stack)
    show_comm.removeChildren()
    names=[]
}

function  createViewModel() {
    const viewModel = new Observable();
    viewModel.set("err_msg", "");
   
    //items_chart.push()
    viewModel.set("items_chart",[{name:"Brave", total:93},{name:"Blaise", total:3}]);

    //console.log(viewModel.get("items"))
  

    
    //console.log(chart_stack)
    viewModel.onNext = (args) => {
        
        //items_chart.push([{name:"Blaise", total:3},{name:"MAhoro", total:13}]);
        const page = frame.topmost().currentPage;
        const num_pl_text = getViewById(page, "pl_num").text;
        num_pl = parseInt(num_pl_text);
        
        if (!Number.isNaN(num_pl)&&num_pl>0) {
            viewModel.set("err_msg", "");
            const grid = getViewById(page, "grid-1");

            grid.visibility = "collapsed";
            const grid2 = getViewById(page, "grid-2");
            const stack = getViewById(page, "stack-0");
            for (let i = 1; i <= num_pl; i++) {
                var textField = new TextField();
                textField.id = i + "";
                textField.hint = "Enter player " + i + " name(optional)";
                stack.addChild(textField);
            }

            //viewModel.players=players;
            grid2.visibility = "visible";
            //viewModel.set('players', players)
        } else {
            viewModel.set("err_msg", "Please a valid  greater than 0.");
        }
       
    };
   
    viewModel.onOK = args => {
        const page = frame.topmost().currentPage;
        const grid2 = getViewById(page, "grid-2");
        grid2.visibility = "collapsed";
        const stack2 = getViewById(page, "stack-2");
        const stack_tot = getViewById(page, "tot-stack");
        stack2.visibility = "visible";
        stack_tot.visibility = "visible";
        var temp_text = "";
        const stack1 = getViewById(page, "stack-1");
        var stackLayout = new StackLayout();


        stackLayout.orientation = "horizontal";
        for (let i = 1; i <= num_pl; i++) {
            //Add name labels at the top
            temp_text = getViewById(page, "" + i).text;
            if (!temp_text.trim()) temp_text = "player" + i;
            temp_text = temp_text + "  ";
            names.push(temp_text);
            console.log(names)
            let label = new Label();
            label.text = temp_text + "  ";
            label.textWrap = true;
            stackLayout.addChild(label);
        }

        const stack_3 = getViewById(page, "stack-3");
        stack_3.addChild(stackLayout);

        const show_comm = getViewById(page, "show_comm")
        let label = new Label();
        label.text=" Current Round comments:";
        show_comm.addChild(label)
        stackLayout = new StackLayout();
        StackLayout.id="comm_stck";
        stackLayout.orientation = "horizontal";
        //comments
        for (let i = 1; i <= num_pl; i++) {
            let textField = new TextField();
            textField.text = "";
            textField.hint = "Comm";
            textField.id = "show_comm" + i;
            stackLayout.addChild(textField);
        }
        show_comm.addChild(stackLayout)
        stackLayout = new StackLayout();
        stackLayout.id = "tot";
        stackLayout.orientation = "horizontal";
        //Total
        for (let i = 1; i <= num_pl; i++) {
            let textField = new TextField();
            textField.text = "0";
            textField.hint = "nm";
            textField.id = "tot" + i;
            stackLayout.addChild(textField);
        }
        stack_tot.addChild(stackLayout);
        stack1.visibility = "visible";
        
    };
    viewModel.onUpdate = () => {
        
        update();
        var items=[]
        for(let i=0; i<totals.length; i++ ){
            items.push({name:names[i], total:totals[i]})
        }
        viewModel.set("items_chart", items)
        const page = frame.topmost().currentPage;
        const chart_stack =  getViewById(page,"bar_chart")
        chart_stack.visibility="visible"
    };
    viewModel.onNewRound = () => {
        const page = frame.topmost().currentPage;
        //const stack1=getViewById(page,"stack-1")
        const stack_3 = getViewById(page, "stack-3");
        //stack_3.visibility="collapsed"
        //get scores from user
        var scroll = new ScrollView()
        scroll.orientation="vertical"
        const score_comm= getViewById(page, "score_comm")
        const overall_grid =getViewById(page, "overall-grid")
        overall_grid.visibility="collapsed"
        console.log(score_comm)
        score_comm.addChild(scroll)
        let label = new Label();
        label.text = "Enter the score and comment(optional) for each player:";
        score_comm.addChild(label)
        stackLayout =new StackLayout()
        stackLayout.orientation = "horizontal";
        for (let i = 1; i <= num_pl; i++) {
            let label= new Label();
            label.text=names[i]
            
            let sc_textField = new TextField();
            sc_textField.text = "";
            sc_textField.hint = names[i-1]+"'s score";
            sc_textField.id = "score" + i;
            let comm_textField=new TextField()
            comm_textField.text = "";
            comm_textField.hint = names[i-1]+"'s Comm";
            comm_textField.id = "comment" + i;
            stackLayout =new StackLayout()
            stackLayout.orientation = "horizontal";
            //stackLayout.addChild(label)
            stackLayout.addChild(sc_textField);
            stackLayout.addChild(comm_textField);
            score_comm.addChild(stackLayout)
        }
        let btn = new Button();
        btn.text ="Add"
        btn.backgroundColor="lightBlue"
        btn.color="black"
        btn.on("tap",()=>{
        stackLayout = new StackLayout();
        stackLayout.orientation = "horizontal";
        round_num++;
        var score_tmp, comm_tmp;
        for (let i = 1; i <= num_pl; i++) {
            let textField = new TextField();
            //Add new scores
            textField.text = getViewById(page, "score"+i).text;

            textField.hint = "score";
            textField.id = round_num + "" + i;
            stackLayout.addChild(textField);
            //update current comment
            getViewById(page, "show_comm"+i).text=getViewById(page,"comment"+i).text
            //update();
            overall_grid.visibility="visible"

        }
        
        stack_3.addChild(stackLayout);

        //stack_3.visibility="visible"
        score_comm.removeChildren()
        update()
        var items=[]
        for(let i=0; i<totals.length; i++ ){
            items.push({name:names[i], total:totals[i]})
        }
        viewModel.set("items_chart", items)

        const chart_stack =  getViewById(page,"bar_chart")
        chart_stack.visibility="visible"
        })
        score_comm.addChild(btn)
        
    };

    viewModel.onNewGame = () => {
        dialogs
            .confirm({
                title: "Game Score App",
                message: "Do you want to start a new game?",
                okButtonText: "Start from scratch",
                cancelButtonText: "Cancel",
                neutralButtonText: "Clear all rounds info"
            })
            .then(function(result) {
                const page = frame.topmost().currentPage
                // result argument is boolean
                if (result == true) {
                    const chart_stack =  getViewById(page,"bar_chart")
                    chart_stack.visibility="collapsed"
                    //start from scratch
                    startFromScratch();
                } else if (result == false) {
                    //do nothing
                } else {
                    const chart_stack =  getViewById(page,"bar_chart")
                    chart_stack.visibility="collapsed"
                    //undefined
                    //remove all rounds, keep all players.
                    resetRounds();
                }
                console.log("Dialog result: " + result);
            });
    };
    viewModel.onHelpButtonTap=()=>{
        dialogs
            .confirm({
                title: "Game Score App",
                message: "Developed by Baise Mahoro.\n in fulfillment of requirements for Assignment 7 of CMSC 4233 (or 5233) in the Spring 2020 course  ",
                okButtonText: "OK",

            })
            .then(function(result) {
               
                //console.log("Dialog result: " + result);
            });
    }
       
    viewModel.onFullChart=()=>{
        const page= frame.topmost().currentPage
        let data =[]
        for (let i = 1; i <= round_num; i++) {
            var total = 0;
            for (let j = 1; j <= num_pl; j++) {
                let text_tmp = getViewById(page, i + "" + j).text;
                var num_tmp = Number.isNaN(parseInt(text_tmp))
                    ? 0
                    : parseInt(text_tmp);
                data.push({name:names[j-1]+"round"+i, score:num_tmp, round:i})
            }
           
        }

        frame.topmost().navigate({
            moduleName:"report/report-page",
            context:{
                data:data,
                rounds:round_num
            }
        })
        // const all_stack = getViewById(page, "all_stack")
        // all_stack.visibility="collapsed"
        const chart_stack =  getViewById(page,"bar_chart")
        chart_stack.visibility="collapsed"
        // const full_report= getViewById(page,"full_report")

        // full_report.visibility="visible"
        

    }
    return viewModel;
}

exports.createViewModel = createViewModel;
