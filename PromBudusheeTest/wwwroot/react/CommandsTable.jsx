class CommandsTable extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const { commands } = this.props;
        console.log(commands);
        return <table>
            <tbody>
                <tr>
                    <th>№</th>
                    <th>Дата и время</th>
                    <th>Команда</th>
                    <th>Параметр 1</th>
                    <th>Параметр 2</th>
                    <th>Параметр 3</th>
                    <th>Статус</th>
                </tr>
                {commands.map(command=>{
                    return <tr key={command.id}>
                        <td>{command.number}</td>
                        <td>{command.dateTime}</td>
                        <td>{command.name}</td>
                        <td>{command.param1 || "0"}</td>
                        <td>{command.param2 || "0"}</td>
                        <td>{command.param3 || "0"}</td>
                        <td>{command.status}</td>
                    </tr>
                })}
            </tbody>
            </table>
    }
}