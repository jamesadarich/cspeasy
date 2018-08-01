using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Cspeasy
{
    public class ContentSecurityPolicy: IContentSecurityPolicyInfo {
        public IEnumerable<PolicyType> DefaultSrc { get; protected set; }
        public IEnumerable<PolicyType> ScriptSrc { get; protected set; }
        public IEnumerable<string> ScriptHashes { get; protected set; }
        public IEnumerable<PolicyType> StyleSrc { get; protected set; }
        public IEnumerable<string> StyleHashes { get; protected set; }
        public IEnumerable<PolicyType> ImgSrc { get; protected set; }
        public IEnumerable<PolicyType> ConnectSrc { get; protected set; }
        public IEnumerable<PolicyType> FontSrc { get; protected set; }
        public IEnumerable<PolicyType> ObjectSrc { get; protected set; }
        public IEnumerable<PolicyType> MediaSrc { get; protected set; }
        [Obsolete("This has been deprecated in CSP2 in favor of 'child-src'")]
        public IEnumerable<PolicyType> FrameSrc { get; protected set; }
        public IEnumerable<SandboxType> Sandbox { get; protected set; }
        public string ReportUri { get; protected set; }
        public bool? ReportOnly { get; protected set; }
        public IEnumerable<PolicyType> ChildSrc { get; protected set; }
        public IEnumerable<PolicyType> FormAction { get; protected set; }
        public IEnumerable<PolicyType> FrameAncestors { get; protected set; }
        public IEnumerable<PluginType> PluginTypes { get; protected set; }

        private ContentSecurityPolicy() { }

        public ContentSecurityPolicy(IContentSecurityPolicyInfo policyInfo)
        {
            DefaultSrc = policyInfo.DefaultSrc ?? Enumerable.Empty<PolicyType>();
            ScriptSrc = policyInfo.ScriptSrc ?? Enumerable.Empty<PolicyType>();
            StyleSrc = policyInfo.ImgSrc ?? Enumerable.Empty<PolicyType>();
            ImgSrc = policyInfo.ImgSrc ?? Enumerable.Empty<PolicyType>();
            ConnectSrc= policyInfo.ConnectSrc ?? Enumerable.Empty<PolicyType>();
            FontSrc = policyInfo.FontSrc ?? Enumerable.Empty<PolicyType>();
            ObjectSrc = policyInfo.ObjectSrc ?? Enumerable.Empty<PolicyType>();
            MediaSrc = policyInfo.MediaSrc ?? Enumerable.Empty<PolicyType>();
            FrameSrc = policyInfo.FrameSrc ?? Enumerable.Empty<PolicyType>();
            Sandbox = policyInfo.Sandbox ?? Enumerable.Empty<SandboxType>();
            ReportUri = policyInfo.ReportUri;
            ReportOnly = policyInfo.ReportOnly;
            ChildSrc = policyInfo.ChildSrc ?? Enumerable.Empty<PolicyType>();
            FormAction = policyInfo.FormAction ?? Enumerable.Empty<PolicyType>();
            FrameAncestors = policyInfo.FrameAncestors ?? Enumerable.Empty<PolicyType>();
            PluginTypes = policyInfo.PluginTypes ?? Enumerable.Empty<PluginType>();
        }

        private ContentSecurityPolicy Clone()
        {
            return new ContentSecurityPolicy()
            {
                DefaultSrc = this.DefaultSrc ?? Enumerable.Empty<PolicyType>(),
                ScriptSrc = this.ScriptSrc ?? Enumerable.Empty<PolicyType>(),
                ScriptHashes = this.ScriptHashes ?? Enumerable.Empty<string>(),
                StyleSrc = this.ImgSrc ?? Enumerable.Empty<PolicyType>(),
                StyleHashes = this.StyleHashes ?? Enumerable.Empty<string>(),
                ImgSrc = this.ImgSrc ?? Enumerable.Empty<PolicyType>(),
                ConnectSrc = this.ConnectSrc ?? Enumerable.Empty<PolicyType>(),
                FontSrc = this.FontSrc ?? Enumerable.Empty<PolicyType>(),
                ObjectSrc = this.ObjectSrc ?? Enumerable.Empty<PolicyType>(),
                MediaSrc = this.MediaSrc ?? Enumerable.Empty<PolicyType>(),
                FrameSrc = this.FrameSrc ?? Enumerable.Empty<PolicyType>(),
                Sandbox = this.Sandbox ?? Enumerable.Empty<SandboxType>(),
                ReportUri = this.ReportUri,
                ReportOnly = this.ReportOnly,
                ChildSrc = this.ChildSrc ?? Enumerable.Empty<PolicyType>(),
                FormAction = this.FormAction ?? Enumerable.Empty<PolicyType>(),
                FrameAncestors = this.FrameAncestors ?? Enumerable.Empty<PolicyType>(),
                PluginTypes = this.PluginTypes ?? Enumerable.Empty<PluginType>()
            };
        }

        public static ContentSecurityPolicy Empty()
        {
            return new ContentSecurityPolicy();
        }

        public ContentSecurityPolicy AddScript(string scriptContent)
        {
            var updatedCsp = Clone();

            var scriptBytes = Encoding.UTF8.GetBytes(scriptContent);

            var hashedContents = SHA256Managed.Create().ComputeHash(scriptBytes).Select(x => x.ToString("x2")).Aggregate((a, b) => $"{a}{b}");

            var scriptList = updatedCsp.ScriptHashes.ToList();
            scriptList.Add(hashedContents.ToString());
            updatedCsp.ScriptHashes = scriptList;

            return updatedCsp;
        }

        public ContentSecurityPolicy AddStyle(string styleContent)
        {
            throw new NotImplementedException();
            /*
             * return new ContentSecurityPolicy({
                ...this as ContentSecurityPolicyInfo,
                styleSrc: [ ...this.styleSrc, `'sha256-${SHA256(styleContent).toString(enc.Base64)}'` as any as PolicyTypes ]
            });
            */
        }

        public ContentSecurityPolicy AddDocument(string documentContent)
        {
            throw new NotImplementedException();

            /*
             * var newCsp = this;

            var document = new JSDOM(documentContent).window.document;
            var scriptHashes = document.querySelectorAll("script").forEach(script => {
                if (!script.innerHTML) {
                    return;
                }

                newCsp = newCsp.addScript(script.innerHTML);
            });

            const styleHashes = document.querySelectorAll("style").forEach(style => {
                if (!style.innerHTML) {
                    return;
                }

                newCsp = newCsp.addStyle(style.innerHTML);
            });

            return newCsp;
            */
        }

        public string GetHeaderValue()
        {
            if (ScriptHashes.Count() > 0)
            {
                return $"script-src {ScriptHashes.Select(x => $"'sha256-{x}'").Aggregate((a, b) => $"{a} {b}")};";
            }

            return string.Empty;
            /*
            return Object.keys(this).map(key => {
                const value = (this as any)[key];

                if (!value || value.length === 0) {
                    return "";
                }

                const policyName = key.replace(/([a-z]+)([A-Z][a-z])+/, "$1-$2").toLowerCase();
                return `${policyName} ${value instanceof IEnumerable ? value.join(" ") : value};`;
            }).join("");
            */
        }
    }
}
