namespace PetHelper.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            if (builder.Environment.IsDevelopment())
                builder.Configuration.AddJsonFile("Secrets.json", optional: true, reloadOnChange: true);

            CreateHostBuilder(args, builder.Configuration).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args, IConfiguration configuration) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureAppConfiguration(config =>
                {
                    config.AddConfiguration(configuration);
                });
    }
}