class CommandsSender extends React.Component{
    constructor(props){
        super(props);

        this.state={
            terminalId: null,
            commandId: null,
            param1: null,
            param2: null,
            param3: null
        };
    }
    
    render() {
        const { availableCommands } = this.props.info;
        const { commandId } = this.state;
        const currentCommand = availableCommands.find(c=>c.id===commandId);
        
        return <div>
            <div id="terminal">
                <div style={{display: 'flex'}}>
                    <p style={{flex: 1}}>ID терминала(ов)</p>
                    <p style={{flex: 1.5}}>Команда</p>
                </div>
                <div id="terminal-input">
                <textarea onChange={e=>this.handleTerminalIdChange(e)} 
                          rows="15" cols="80" />
                
                <select className="form-select" onChange={e=>this.handleCommandChange(e)}>
                    <option selected={commandId === null} value={null}>Выберите команду</option>
                    {availableCommands.map(command=>{
                        return <option key={command.id} value={command.id} selected={command.id === commandId}>
                            &#9679; {command.name}
                        </option>
                    })}
                </select>
            </div>
            </div>
            
            {!currentCommand
                ? null
                : <div id="parameters">
                    { currentCommand.parameter_name1
                        ? <div>
                            <p>{currentCommand.parameter_name1}</p>
                            <input key={currentCommand.parameter_name1} type="text" 
                                   className="form-control"
                                   onChange={e=>this.handleParamChange(e, 1)} 
                                   defaultValue={currentCommand.parameter_default_value1}/>
                        </div>
                        : null
                    }
                    { currentCommand.parameter_name2
                        ? <div>
                            <p>{currentCommand.parameter_name2}</p>
                            <input key={currentCommand.parameter_name2} type="text"
                                   className="form-control"
                                   onChange={e=>this.handleParamChange(e, 2)}
                                   defaultValue={currentCommand.parameter_default_value2}/>
                        </div>
                        : null
                    }
                    { currentCommand.parameter_name3
                        ? <div>
                            <p>{currentCommand.parameter_name3}</p>
                            <input key={currentCommand.parameter_name3} type="text"
                                   className="form-control"
                                   onChange={e=>this.handleParamChange(e, 3)}
                                   defaultValue={currentCommand.parameter_default_value3}/>
                        </div>
                        : null
                    }
                </div>
            }
            <div id="buttons">
                <button className="btn btn-dull">Назад</button>
                <button className="btn btn-bright" onClick={e=>this.submitCommand(e)}>Отправить</button>
            </div>
        </div>
    }
    
    handleTerminalIdChange = event => {
        const value = parseInt(event.target.value);
        this.setState({terminalId: value});
    }
    
    handleCommandChange = event => {
        const value = parseInt(event.target.value); 
        const { availableCommands } = this.props.info;
        const currentCommand = availableCommands.find(c=>c.id === value);
        const {parameter_default_value1, parameter_default_value2, parameter_default_value3} = currentCommand;
        this.setState({
            commandId: value,
            param1: parameter_default_value1,
            param2: parameter_default_value2,
            param3: parameter_default_value3
        });
    }
    
    handleParamChange = (event, paramNumber) => {
        const value = event.target.value;
        if(paramNumber === 1) this.setState({param1: value});
        if(paramNumber === 2) this.setState({param2: value});
        if(paramNumber === 3) this.setState({param3: value});
    }
    
    submitCommand = async event => {
        event.preventDefault();
        
        const { terminalId, commandId, param1, param2, param3 } = this.state;
        const { availableCommands, token } = this.props.info;
        
        const formData = new FormData();
        formData.append("dto.TerminalId", terminalId);
        formData.append("dto.CommandId", commandId);
        if(param1) formData.append("dto.Param1", param1);
        if(param2) formData.append("dto.Param2", param2);
        if(param3) formData.append("dto.Param3", param3);
        
        await fetch(`/terminal/send-command?token=${token}`,{
            method: 'POST',
            body: formData
        }).then(async response=>{
            if(response.status === 200){
                const dateTime = await response.text();
                const command = availableCommands.find(c=>c.id === commandId);
                this.setState({commandId: null})
                const info = {
                    dateTime, 
                    name: command.name,
                    param1,
                    param2,
                    param3,
                    status: "Не отправлена"
                };
                this.props.onCommandSubmitted(info);
            }
        })
    }
}