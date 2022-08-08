const myQuestions = [
/* needs explaination and additional choice
{
question: "An analyst within your organization provides the following information about a process she is investigating. Which of the following artifacts indicate that the application may be malicious? <br><br> updater.exe pid: 284 <br> Command line : C:\\Docume~1\\INFOSE~1\\LOCALS~1\\Temp\\updater.exe <br> www.Microsoft.com/update",
answers: {
a: "The virus is attempting to hide its folder by using ~1",
b: "PIDSs below 1024 are reserved for Kernel processing",
c: "Processes should not continue to run from temporary locations",
d: ""
},
correctAnswer: "c",
explaination: "Processes should not continue to run from temporary locations"
},
*/
{
question: 'The server administrators and security team at the Angry Chinchilla marketing firm have scheduled a third party audit of their externally facing infrastructure as a result of a recent security breach. Which of the following phases of the Incident Response Process does the audit fall under?',
answers: {
a: "Identification",
b: "Follow up",
c: "Remediation",
d: "Recovery"
},
correctAnswer: "b",
explaination: "Follow up activities include re-testing the security of an environment after a breach or suspected security event."
},
{
question: "Services.exe is the parent process for which of the following?",
answers: {
a: "LSASS",
b: "svchost.exe",
c: "winit.exe",
d: "LSM"
},
correctAnswer: "b",
explaination: "The parent process is services.exe. The parent process for both LSM.exe and LSASS.exe is wininit.exe. Wininit.exe is created by an instance of smss.exe that exits, so tools usually do not provide the parent process name."
},
/* question about services and the accounts they are launched with?
{
question: "Which service?",
answers: {
a: "winit.exe",
b: "svchost",
c: "winlogon",
d: "services.exe"
},
correctAnswer: "b",
explaination: "Depending on svchost instance svchost User Account will typically be Local System, Network Service, or Local Service accounts. Instances running under any other account should be investigated. Winlogon, services and wininit run under the Local System account."
},

{
question: "Which of the following is a typical behavior of an archive utility when decompressing files on a NTFS volume?",
answers: {
a: "The $Filename timestamp will reflect the time the archive was decompressed",
b: "Date stamps reflect the time the archive was opened on the system",
c: "Date stamps reflect the time that they were before archive was created",
d: "The $Standard_Information timestamp will record the time the user compressed the file"
},
correctAnswer: "c",
explaination: "Timestamps for decompressed archive files are typically do not do not overwrite the file’s original timestamps."
},
{
question: "Which of the following ntfs timestamps will change when an administrator gives ownership of a file to a user?",
answers: {
a: "Metadata change (C)",
b: "Modified date (M)",
c: "Access date (A)",
d: "Created date (B)"
},
correctAnswer: "a",
explaination: "The ownership permission for a NTFS file are metadata and the metadata change time will be updated when access or permissions are modified."
},
{
question: "Which of the following files would you expect to see in the AppCompatCache registry key to provide evidence that it was launched on a Windows system?",
answers: {
a: "networkcap.pcap",
b: "backup.job",
c: "get-hosts.ps1",
d: "cruising.bat"
},
correctAnswer: "d",
explaination: "The AppCompatCache registry key contains entries for applications that have been run on a Windows system. The only file that would be run by the system in the list is the BAT file."
},
{
question: "A computer on a local area network has been identified as being compromised by a remote access tool. What is the next step in the identification phase of incident handling?",
answers: {
a: "Image the compromised system for forensic analysis",
b: "Notify the authorities",
c: "determine if other network systems have been compromised",
d: "Isolate the compromised system from the network"
},
correctAnswer: "c",
explaination: "An integral part of identifying a breach is to determine the scope of the breach. It makes little sense to isolate one compromised system when multiple systems have been compromised. Imaging a compromised system would take place after the scope of the compromise has been identified. Notifying the authorities may or may not take place, depending on the directives of upper management."
},
{
question: 'Which process requires further investigation?  <br><br> <img src="./question8.png">',
answers: {
a: "858",
b: "2520",
c: "496",
d: "4"
},
correctAnswer: "b",
explaination: "PID 2520 has the name scvhost.exe which is very similar to svchost.exe. Also, it has an increasing internal listening port connecting to various internet-based servers on port 25. This is not normal or standard behavior for a client device. The PIDS 496, 868, and 508 are common targets but they are legitimate here."
},
{
question: "You are reviewing a recent incident at your organization. An unauthorized connection from a workstation to a malicious server was captured by the organization’s IDS. The incident response team found the compromised workstation, removed it from the network, gathered evidence, reimaged the computer, blocked the malicious IP address, and placed the workstation back on the network. Shortly after the workstation was removed from the network, the IDS identified two other workstations attempting to send traffic to the same malicious server, resulting in a slow resolution to the incident. Which step was the root cause of the slow resolution, and should be improved to increase the efficiency of your organization’s incident response process?",
answers: {
a: "Remediation",
b: "recovery",
c: "containment",
d: "identification"
},
correctAnswer: "d",
explaination: "Consists of scoping compromised systems. Once an incident was identified, all compromised workstations should have been identified. Containment, remediation, and recovery were effective for the single workstation that was identified, but identifying additional compromised computers would have saved time and prevented the IR team from backtracking."
},
{
question: "Review the attached screen capture. What is the most likely event that caused the difference between the first and second time exiftool was run against T:\chips.exe?",
answers: {
a: "The MFT sequence number of the file was changed, resulting in the timestamps from another file",
b: "When exiftool touched chips.exe, the file’s timestamps were updated to the local system time",
c: "The user copied chips.exe to another location and moved it back to T:",
d: "The timestamps were manually altered using an anti-forensics tool"
},
correctAnswer: "d",
explaination: "The timestamps were manually altered using an anti-forensics tool. This is an example of a timestamp anomaly. In this case, the file modification date and time listed in the metadata actually went back by 11 days. This is not explainable by natural computer behavior, and indicates that, between the first time the command was run and the second time, some form of timestamp alteration (like timestomp) occurred. Copying the file or touching it (which exiftool does not do) would not change all the timestamps. It is highly unlikely the MFT sequence number would have changed."
},
{
question: " Which of the following choices is a resident attribute of the Mater File Table?",
answers: {
a: "File name",
b: "Security descriptors",
c: "Data for larger files",
d: "File indexes"
},
correctAnswer: "a",
explaination: "Resident attributes include standard info, security, file name($File_Name, and data (small file). Non-resident attributes include data (larger files), security descriptors and file indexes."
},
{
question: "Which MFT is preserved after a file is deleted from an NTFS volume?",
answers: {
a: "$Bitmap",
b: "$LogFile",
c: "$FILE_name",
d: "$CHAIN"
},
correctAnswer: "c",
explaination: "When a file is deleted on an NTFS partition: 1) The file name is removed form the parent directory index. 2) The MFT Entry is unallocated by clearing the in use flag($Bitmpa). 3) The clusters are unallocated. The file deletion process also prompts changes to the file system journal ($LogFile). $chain is non-existent. The file name attributes remain intact."
},
{
question: 'While performing a forensic investigation, an anlyst runs Volatility’s malfind plugin against a memory image which produces the following output. What has the malfind plugin identified about the process that makes it suspicious?  <br><br> <img src="./question13.png">',
answers: {
a: "The built-in YARA rule set has identified known malware at address 0x680000",
b: "The Microsoft Portable Executable ZQ header is present in the process memory section",
c: "The MapViewOfSection function in the process memory has been identified as malicious",
d: "The process memory section is marked as executable with no associated mapped file on disk"
},
correctAnswer: "d",
explaination: "Volatility’s malfind plugin scans memory looking for sections marked as executable with no associated mapped file on disk and files in the Microsoft Portable Executable (PE) format. In this case the malfind plugin identified the memory section as executable (PAGE_EXECUTE_READWRITE). The Microsoft PE header is identified by MZ and not ZQ in the hex output. There are no built-in Yara rules and they are not checked by default. the MapViewOFSection function in the process in not malicious."
},
{
question: "On a target system, RAM is collected an then PsList is run. Which of the following would explain why the list of processes reported by PsList does not match that extracted later form the memory image?",
answers: {
a: "Anti-virus is running on the target system",
b: "Administrator privileges were not used to collect RAM",
c: "A rootkit is installed on the target system",
d: "PsList does not report on idle processes"
},
correctAnswer: "c",
explaination: "A rootkit running on the target system may hide information from, or present false information to, PsList and other similar tools as they rely on operating system functions. An anti-virus would not impact PsList output. Admin privileges are always needed to acquire RAM. PsList does report on idle processes (unless a rootkit intervened."
},
{
question: "Which of the following artifacts indicates program execution?",
answers: {
a: "BagMRU",
b: "SetupAPI.log",
c: "LNK file",
d: "Prefecth"
},
correctAnswer: "d",
explaination: ""
},
/* ADS question, needs additional choices
{
question: "How are Alternative data streams stored",
answers: {
a: "as an attribute in the master file table",
b: "",
c: "",
d: ""
},
correctAnswer: "a",
explaination: ""
},

{
question: "On a target system, RAM is collected an then PsList is run. Which of the following would explain why the list of processes reported by PsList does not match that extracted later form the memory image?",
answers: {
a: "Anti-virus is running on the target system",
b: "Administrator privileges were not used to collect RAM",
c: "A rootkit is installed on the target system",
d: "PsList does not report on idle processes"
},
correctAnswer: "c",
explaination: "A rootkit running on the target system may hide information from, or present false information to, PsList and other similar tools as they rely on operating system functions. An anti-virus would not impact PsList output. Admin privileges are always needed to acquire RAM. PsList does report on idle processes (unless a rootkit intervened."
},
{
question: "You have collected a disk and memory image of the infected?system. You have run an anti-virus scanner but have been unable to find the malware’s main executable on the disk image file system. Which of the following will increase the possibility of finding the malware executable",
answers: {
a: "Re-scan the image with the default AV settings",
b: "Perform the advanced heuristics AV scan",
c: "Perform a timeline analysis of the filesystem image",
d: "Run Volatility on the image and scan the processes"
},
correctAnswer: "d",
explaination: "The malware programs are known to persist only in memory after its execution, therefore, we understand it will try to remove all evidence on the disk to prevent tits detection. Dumping the system processes on memory will retrieve the unpacked malware’s image, but we are looking for the packed executable file. Any A/V scanner will focus on allocated files on the image file system, thus the malware’s main executable could still be recovered, if it was not overwritten, as a deleted file by Sorter and detected afterwards with an A/V scanner"
},
{
question: " Which of the following NTFS timestamps will change when an administrator gives ownership permissions of a file to a user?",
answers: {
a: "Metadata change (C)",
b: "Access date (A)",
c: "Created date (B)",
d: "Modified date (M)"
},
correctAnswer: "a",
explaination: "The ownership permission for a NTFS file are metadata and the metadata change time will be updated when access or permissions are modified."
},
{
question: " After a security even thas been addressed by the incident response team, and the seucirty team has deployed the recommended security patches, management determines that a penetration test of the environment is required to ensure that the systems are no longer vulnerable to the identified threat. During their audit, the penetration testing team identified several servers that were vulnerable to the same attack. What phase of the initial incident response process identifies the penetration test?",
answers: {
a: "containment and intelligence gathering",
b: "identification",
c: "remediation",
d: "follow up"
},
correctAnswer: "d",
explaination: "The penetration test is considered in a follow up activity of the initial incident. If the organization was adhering to the IR model, after the threat has was identified, contained and remediated the organization would implement the controls necessary to prevent future exposure in the recovery phase and then verify the threats were no longer present in the environment in the follow up phase with a penetration test or vulnerability assessment."
},
{
question: "As part of a forensic analysis on a Windows sytem file, you need to know the last time the file was edited, as well as how many times it was edited in the past and the approximate date of these edits. What ouwld be the most accurate approach to this problem?",
answers: {
a: "Check the MACB times on the original file, and record the M and C times as edits",
b: "Compare multiple versions of the file from Resotre Points or Volume Shadow copies",
c: "Compete a string search against your timeline for the filename and export the results",
d: "Check the user’s “Recent docuemnts” folder for the system file"
},
correctAnswer: "b",
explaination: "The most accurate method of catching the edits to a system file would be to check System Restore points or VSS at various dates and comparing the file between dates. Completing a string search against your timeline for the filename will not turn up each system restore point or volume shadow copy, because the filenames in theose systems are different, and for the original file, the imeline will only track the last time the file was modified. searhing forevidence in the user’s recent documents folder is not the most accurate method of deteriming how many times the file was accessed"
},
{
question: "An analyst is reviewing data from a windows 2003 server involved in an intrusion incident. While the super timeline is being collected, they read through notes of the system administrator who responded to the incident. 5/30/2012 2:03 pm EST: When I got to the server, user ID jlawson [a network admin] had been logged in since 5/14. Task manager showed processes like svchost, explorer, spoolsv, iexplore running. I didn’t see any brower windows open. I saw an unusual volume of network traffic going to 172.44.37.242, an unknown IP address. Assuming each of the filters below produce results, what criteria should be used to create a starting point for your investigation?",
answers: {
a: "Search for the first occurrence of 173.44.37.242",
b: "Search for all entries containing iexplore",
c: "Narrow to a time window of 5/14 through 5/30",
d: "Start from the first entry of the timeline"
},
correctAnswer: "a",
explaination: "If the system admin identified an unusual volume of traffic going to the IP address should be your pivot point, the first occurrence you would find installations, processes, or net activity. Narrowing the timeline would be unmanageable. Since iexplore is internet explorer, narrowing the search would create a large number of entries. Starting form the first entry would give you the logs from when the computer system was created, not helpful."
},
{
question: "Which of the following tools could be used to create a timeline baseline of a file system?",
answers: {
a: "Norton Ghost",
b: "strings",
c: "foremost",
d: "mactime"
},
correctAnswer: "d",
explaination: "The specialized applications fls, ils and mactime can be used together to create a timeline for a volume/image. The application strings prints the printable characters of a file, Norton ghost is used to create a copy or clone of a drive and foremost can be used to recover files using their headers, footers and data structures."
},
{
question: "What tool integrates with a Plaso storage file?",
answers: {
a: "Pinfo",
b: "Psort",
c: "Plasm",
d: "Log2timeline"
},
correctAnswer: "d",
explaination: "log2timeline includes a “mactime” parser that allows timestamped memory artifacts collected by the Volatility “timeliner” plug-in to be integrated into a Plaso storage file. Pinfo dumps the metadata from a Plaso storage file. Psort allows filtering and viewing of events in a Plaso storage file. Plasm groups and tags events in a Plaso storagefile."
},
{
question: "When an executable is signed with a trusted code signing certificate which of the following is allowed?",
answers: {
a: "The operating system will allow the program to be run without user interaction",
b: "The host can revert to known good copy of the application if the certificate is compromised",
c: "The program will be able to run with administrative or system privileges",
d: "The application can be added to a white list and run at boot time"
},
correctAnswer: "a",
explaination: "Code signing certificates are important for establishing a level of security and trust between the developers and the end user. These certificates can become compromised in rare situations and be revoked by the issuing authority. If this happens the code signed with these certificates should not be trusted. A windows host will allow trusted applications to be run without user interaction."
},
{
question: "Which of the following searches should be performed first when reducing a dataset for malware analysis?",
answers: {
a: "MFT anomalies",
b: "Super timeline",
c: "Evidence persistence",
d: "indicators of compromise"
},
correctAnswer: "d",
explaination: "The malware funneling process can be a lengthy one. Typically, an examiner may start with thousands of files. The typical process starts with automated data reduction and filtering. The process is followed by a review for persistence and eventually super timeline analysis and MFT anomaly examination."
},
{
question: "How is the Kernel Debuger Datablock (KDBG) most commonly used when performing forensic analysis?",
answers: {
a: "To dump the contents of memory to a file immediately prior to a kernel fault",
b: "To generate a list of new files generated by a specific executable",
c: "To generate a list of processes currently running in memory",
d: "To identify processes that write onto buffers beyond what is allocated"
},
correctAnswer: "c",
explaination: "The Kernel Debugger Datablockis most commonly used for memory analysis by tools that follow the pointer through the KDBG to generate a process list for the system."
},
{
question: 'Review the attached screen capture. What is the most likely event that caused the difference between the first and second time exiftool was run against T:\chips.exe? <br><br> <img src="./question15.png" ',
answers: {
a: "The MFT sequence number of the file was changed, resulting in the timestamps from another file",
b: "When exiftool touched chips.exe, the file’s timestamps were updated to the local system time",
c: "The user copied chips.exe to another location and moved it back to T:",
d: "The timestamps were manually altered using an anti-forensics tool"
},
correctAnswer: "d",
explaination: "This is an example of a timestamp anomaly. In this case, the file modification date and time listed in the metadata actually went back by 11 days. This is not explainable by natural computer behavior, and indicates that, between the first time the command was run and the second time, some form of timestamp alteration (like timestomp) occurred. Copying the file or touching it (which exiftool does not do) would not change all the timestamps. It is highly unlikely the MFT sequence number would have changed. "
},
*/
];