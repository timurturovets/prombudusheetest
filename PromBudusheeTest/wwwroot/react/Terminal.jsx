class Terminal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoadingData: true, 
            token: null, 
            availableCommands: [], 
            userCommands: []
        };
    }
    
    componentDidMount(){
        this.loadData();
    }
    
    loadData = async () => {
        let { isLoadingData, token, availableCommands } = this.state;
        await fetch(`terminal/get-token`)
            .then(async response => {
                const result = await response.text();
                const json = await JSON.parse(result);
                token = json.token;
                
        });
        
        if(!token) {
            alert('Произошла ошибка при авторизации');
            return;
        }
        
        await fetch(`terminal/get-commands?token=${token}`)
            .then(async response=>{
                const result = await response.text();
                const json = await JSON.parse(result);
                availableCommands = json.items;
            });
        
        isLoadingData = false;
        this.setState({isLoadingData, token, availableCommands});
    }
    render() {
        const {isLoading, token, availableCommands, userCommands } = this.state;
        const senderInfo = {token, availableCommands};
        return isLoading
            ? null
            : <div>
                <CommandsSender info={senderInfo} onCommandSubmitted={this.handleCommandSubmit} />
                <CommandsTable commands={userCommands} />
            </div>
    }
    
    handleCommandSubmit = info => {
        let { userCommands } = this.state;
        for(let i = 0; i < userCommands.length; i++){
            userCommands[i].number++;
        }
        userCommands.push({number:1, ...info});
        userCommands = userCommands.sort((a, b) => a.number - b.number);
        this.setState({userCommands});
    }
}