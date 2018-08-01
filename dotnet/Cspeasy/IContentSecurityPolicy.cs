using System;
using System.Collections.Generic;

namespace Cspeasy
{
    public interface IContentSecurityPolicyInfo
    {
        IEnumerable<PolicyType> DefaultSrc { get; }
        IEnumerable<PolicyType> ScriptSrc { get; }
        IEnumerable<PolicyType> StyleSrc { get; }
        IEnumerable<PolicyType> ImgSrc { get; }
        IEnumerable<PolicyType> ConnectSrc { get; }
        IEnumerable<PolicyType> FontSrc { get; }
        IEnumerable<PolicyType> ObjectSrc { get; }
        IEnumerable<PolicyType> MediaSrc { get; }
        IEnumerable<PolicyType> FrameSrc { get; }
        IEnumerable<SandboxType> Sandbox { get; }
        string ReportUri { get; }
        bool? ReportOnly { get; }
        IEnumerable<PolicyType> ChildSrc { get; }
        IEnumerable<PolicyType> FormAction { get; }
        IEnumerable<PolicyType> FrameAncestors { get; }
        IEnumerable<PluginType> PluginTypes { get; }
    }
}