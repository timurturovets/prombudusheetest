var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddCors();

var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()); 


app.MapControllerRoute(
    "default",
    "{controller=Terminal}/{action=Main}");

app.Run();