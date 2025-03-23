
import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Sun,
  Moon,
  Bell,
  VolumeX,
  Volume2,
  Save,
  RotateCcw,
  languages
} from 'lucide-react';
import { toast } from "sonner";

interface SettingsState {
  darkMode: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  focusDuration: number;
  breakDuration: number;
  username: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: false,
    notificationsEnabled: true,
    soundEnabled: true,
    soundVolume: 70,
    focusDuration: 25,
    breakDuration: 5,
    username: 'User',
  });
  
  // Load settings from localStorage on init
  useEffect(() => {
    const savedSettings = localStorage.getItem('taskMasterSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      
      // Apply dark mode if saved
      const parsedSettings = JSON.parse(savedSettings);
      document.documentElement.classList.toggle('dark', parsedSettings.darkMode);
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setSettings(prev => {
      const newDarkMode = !prev.darkMode;
      document.documentElement.classList.toggle('dark', newDarkMode);
      return { ...prev, darkMode: newDarkMode };
    });
  };
  
  // Save settings
  const saveSettings = () => {
    localStorage.setItem('taskMasterSettings', JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };
  
  // Reset settings
  const resetSettings = () => {
    const defaultSettings: SettingsState = {
      darkMode: false,
      notificationsEnabled: true,
      soundEnabled: true,
      soundVolume: 70,
      focusDuration: 25,
      breakDuration: 5,
      username: 'User',
    };
    
    setSettings(defaultSettings);
    document.documentElement.classList.toggle('dark', defaultSettings.darkMode);
    localStorage.setItem('taskMasterSettings', JSON.stringify(defaultSettings));
    toast.success("Settings reset to defaults");
  };
  
  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <Container>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Task Master experience
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Display Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle>Display</CardTitle>
              <CardDescription>
                Adjust how Task Master looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Notifications Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <Label htmlFor="notifications">Enable Notifications</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, notificationsEnabled: checked }))
                  }
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  <Label htmlFor="sound">Sound Effects</Label>
                </div>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, soundEnabled: checked }))
                  }
                />
              </div>
              
              {settings.soundEnabled && (
                <div className="pt-2">
                  <Label htmlFor="volume" className="mb-2 block">
                    Volume: {settings.soundVolume}%
                  </Label>
                  <Slider
                    id="volume"
                    defaultValue={[settings.soundVolume]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => 
                      setSettings(prev => ({ ...prev, soundVolume: value }))
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Focus Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle>Focus Settings</CardTitle>
              <CardDescription>
                Customize your focus sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="focus-duration" className="mb-2 block">
                  Focus Session Duration: {settings.focusDuration} minutes
                </Label>
                <Slider
                  id="focus-duration"
                  defaultValue={[settings.focusDuration]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={([value]) => 
                    setSettings(prev => ({ ...prev, focusDuration: value }))
                  }
                />
              </div>
              
              <div className="pt-2">
                <Label htmlFor="break-duration" className="mb-2 block">
                  Break Duration: {settings.breakDuration} minutes
                </Label>
                <Slider
                  id="break-duration"
                  defaultValue={[settings.breakDuration]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={([value]) => 
                    setSettings(prev => ({ ...prev, breakDuration: value }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          
          {/* User Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Personalize your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username" className="mb-2 block">
                  Display Name
                </Label>
                <Input
                  id="username"
                  className="input-glass"
                  value={settings.username}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, username: e.target.value }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={resetSettings} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset Defaults
            </Button>
            <Button onClick={saveSettings} className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Settings;
