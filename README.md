# What is this project:
I have to install Windows a lot on many different systems. Naturally, there are solutions to this problem like https://puppet.com/ and https://www.chef.io/ but these solutions are for an enterprise environment and generally too complex for my use cases. Thus I created a simple step by step tutorial script for all the installation processes I have to do. Because different installations are done for different people and satisfy different requirements, many steps can be skipped and some steps contain software that gives you the choice to install different modules. Basically, the script contains all possible steps for installation, but rarely you will need to execute all of them. The script also is built with remote installation or configuration in mind. Remote installations/configurations are done via Anydesk or Teamviewer depending on the use case. 

# Where to start:
If you are doing windows install - start from the "WindowsInstallationSCRIPT" folder. If you are doing Linux install check the "Linux" directory. The Linux directory contains much fewer steps because I have to install Linux much less. 

# General logic of the install process:
The only step that cannot be done remotely is the initial Windows OS installation. After this, the general idea is to install drivers and software + make different configurations and this can be done remotely over Anydesk. Most software ( besides Anydesk and a starting browser like Chrome, Brave, or Firefox) is installed and maintained via the choco (https://chocolatey.org/) package manager. Windows versions that are used for installation are depending on the person: normally Windows LTSC is used, but if the client provides his/her own windows version, it is used instead. Windows Enterprise is used for dev machines instead of LTSC ( although Linux is also used for dev machines, it depends on the use case).

# Security aspects:
Some steps are decreasing the security of the system and may not be a good idea in different use cases. These steps are usually highlighted as being a security threat. These steps are however included because they make work with Windows much less convenient. In other words, the more you increase convenience, the more you decrease security. 

# How you can help this project:
1. You can recommend more programs, installation processes for Linux.
2. You can add more programs to the list of useful programs upon installation. Currently this list can be found on "After-install-automation\WindowsInstallationSCRIPT\8.0 AllChocolateyProgramsInstalledExport\Install.ps1" .
3. You can add steps you do when you install Windows/Linux.
4. You can include similar projects as links to this one.

# Repos:
The main repo is at https://gitlab.com/Xynnect/windows-after-install-script-collection 
All other repos are just mirrors

# Licence:
Everyone is free to use the script and add his/her own additions to it. For the code part, I guess the MIT Licence best fits the idea of giving people maximum freedom over the code. 
License - MIT for my code
IMPORTANT: There are executables bundled in this repo from other developers and I hold no intellectual property over them, neither I claim to have any. If you decide to use the script and install a program like for example Chrome from the provided executable installers, all rights are reserved to the developer - in this case, Google. 