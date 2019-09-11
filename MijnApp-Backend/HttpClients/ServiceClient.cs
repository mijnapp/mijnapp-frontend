using System.Net.Http;
using System.Threading.Tasks;

namespace MijnApp_Backend.HttpClients
{
    public interface IServiceClient
    {
        Task<HttpResponseMessage> GetAsync(string url);
        Task<HttpResponseMessage> PostAsync(string url, HttpContent content);
    }

    public class ServiceClient : IServiceClient
    {
        private readonly HttpClient _client;

        public ServiceClient(HttpClient client)
        {
            _client = client;
        }

        public async Task<HttpResponseMessage> GetAsync(string url)
        {
            return await _client.GetAsync(url);
        }

        public async Task<HttpResponseMessage> PostAsync(string url, HttpContent content)
        {
            return await _client.PostAsync(url, content);
        }
    }
}
