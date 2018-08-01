using Microsoft.VisualStudio.TestTools.UnitTesting;
using Cspeasy;
using System.Security.Cryptography;
using System.Text;
using System.Linq;

namespace Test
{
    [TestClass]
    public class ScriptSrcTests
    {
        [TestMethod]
        public void AddingScriptReturnsNewPolicy()
        {
            var testPolicy = ContentSecurityPolicy.Empty();
            Assert.AreNotSame(testPolicy, testPolicy.AddScript("console.log('example script');"));
        }

        [TestMethod]
        public void AddingScriptAddsHashToHeaderValue()
        {
            var testPolicy = ContentSecurityPolicy.Empty();

            var scriptContents = "console.log('example script');";

            var scriptBytes = Encoding.UTF8.GetBytes(scriptContents);

            var hashedContents = SHA256Managed.Create().ComputeHash(scriptBytes).Select(x => x.ToString("x2")).Aggregate((a, b) => $"{a}{b}");

            Assert.AreEqual($"script-src 'sha256-{hashedContents}';", testPolicy.AddScript(scriptContents).GetHeaderValue());
        }

        [TestMethod]
        public void AddingTwoScriptsAddsHashesToHeaderValue()
        {
            var testPolicy = ContentSecurityPolicy.Empty();

            var firstScriptContents = "console.log('first script');";

            var firstScriptBytes = Encoding.UTF8.GetBytes(firstScriptContents);

            var firstHashedContents = SHA256Managed.Create().ComputeHash(firstScriptBytes).Select(x => x.ToString("x2")).Aggregate((a, b) => $"{a}{b}");

            var secondScriptContents = "console.log('second script');";

            var secondScriptBytes = Encoding.UTF8.GetBytes(secondScriptContents);

            var secondHashedContents = SHA256Managed.Create().ComputeHash(secondScriptBytes).Select(x => x.ToString("x2")).Aggregate((a, b) => $"{a}{b}");

            Assert.AreEqual($"script-src 'sha256-{firstHashedContents}' 'sha256-{secondHashedContents}';", testPolicy.AddScript(firstScriptContents).AddScript(secondScriptContents).GetHeaderValue());
        }
    }
}
