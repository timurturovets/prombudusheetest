using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace PromBudusheeTest.Controllers;

public class TerminalController : Controller
{
    private const string Host = "http://178.57.218.210:198";
    
    public IActionResult Main()
    {
        return View();
    }

    [HttpGet(@"/terminal/get-token")]
    public async Task<string> GetToken()
    {
        using var client = new HttpClient();
        var response = await client
            .GetAsync($"{Host}/token?login=part&password=part");
        return await response.Content.ReadAsStringAsync();
    }

    [HttpGet(@"/terminal/get-commands")]
    public async Task<string> GetCommands([FromQuery] string token)
    {
        using var client = new HttpClient();
        var response = await client
            .GetAsync($"{Host}/commands/types?token={token}");
        return await response.Content.ReadAsStringAsync();
    }

    [HttpPost(@"/terminal/send-command")]
    public async Task<string> SendCommand([FromForm] CommandDto dto, [FromQuery] string token)
    {
        using var client = new HttpClient();

        var body = new
        {
            command_id = dto.CommandId,
            parameter1 = dto.Param1,
            parameter2 = dto.Param2,
            parameter3 = dto.Param3,
            str_parameter1 = "string",
            str_parameter2 = "string"
        };

        
        await client.PostAsJsonAsync($"{Host}/terminals/{dto.TerminalId}/commands?token={token}", JsonSerializer.Serialize(body));
        return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    }
}

public class CommandDto
{
    public int TerminalId { get; set; }
    public string? CommandId { get; set; }
    public string? Param1 { get; set; }
    public string? Param2 { get; set; }
    public string? Param3 { get; set; }
}