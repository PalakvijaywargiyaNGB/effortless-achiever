
import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sun,
  Moon,
  Bell,
  VolumeX,
  Volume2,
  Save,
  RotateCcw,
  Globe,
  Palette
} from 'lucide-react';
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface SettingsState {
  darkMode: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  focusDuration: number;
  breakDuration: number;
  username: string;
  // New settings properties
  language: string;
  colorTheme: string;
  highContrastMode: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  autoSave: boolean;
}

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' }
];

const availableThemes = [
  { id: 'system', name: 'System Default' },
  { id: 'dark', name: 'Dark Mode' },
  { id: 'light', name: 'Light Mode' },
  { id: 'blue', name: 'Blue' },
  { id: 'green', name: 'Green' },
  { id: 'purple', name: 'Purple' }
];

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    darkMode: false,
    notificationsEnabled: true,
    soundEnabled: true,
    soundVolume: 70,
    focusDuration: 25,
    breakDuration: 5,
    username: 'User',
    // Initialize new settings with defaults
    language: 'en',
    colorTheme: 'system',
    highContrastMode: false,
    reducedMotion: false,
    largeText: false,
    autoSave: true,
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
  
  // Apply theme change
  const changeTheme = (theme: string) => {
    // This would eventually be expanded to apply different theme classes
    setSettings(prev => ({ ...prev, colorTheme: theme }));
    
    // Basic implementation of theme switching
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Additional theme classes could be added here
    document.documentElement.setAttribute('data-theme', theme);
  };
  
  // Apply accessibility settings
  const applyAccessibilitySettings = () => {
    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', settings.highContrastMode);
    
    // Apply reduced motion
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Apply large text
    document.documentElement.classList.toggle('large-text', settings.largeText);
  };
  
  useEffect(() => {
    applyAccessibilitySettings();
  }, [settings.highContrastMode, settings.reducedMotion, settings.largeText]);
  
  // Save settings
  const saveSettings = () => {
    localStorage.setItem('taskMasterSettings', JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };
  
  // Auto-save settings when changed (if enabled)
  useEffect(() => {
    if (settings.autoSave) {
      const timer = setTimeout(() => {
        saveSettings();
      }, 1000); // Debounce save
      
      return () => clearTimeout(timer);
    }
  }, [settings]);
  
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
      language: 'en',
      colorTheme: 'system',
      highContrastMode: false,
      reducedMotion: false,
      largeText: false,
      autoSave: true,
    };
    
    setSettings(defaultSettings);
    document.documentElement.classList.toggle('dark', defaultSettings.darkMode);
    document.documentElement.setAttribute('data-theme', defaultSettings.colorTheme);
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
          {/* Language Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Choose your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language-select" className="mb-2 block">Select Language</Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {availableLanguages.map((lang) => (
                    <div 
                      key={lang.code}
                      className={`relative rounded-md border p-3 cursor-pointer transition-all ${settings.language === lang.code ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                      onClick={() => setSettings(prev => ({ ...prev, language: lang.code }))}
                    >
                      <div className="text-center">
                        <div className="font-medium">{lang.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Display Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Display & Themes
              </CardTitle>
              <CardDescription>
                Adjust how Task Master looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
              
              <div>
                <Label className="mb-3 block">Color Theme</Label>
                <RadioGroup 
                  value={settings.colorTheme}
                  onValueChange={(value) => {
                    changeTheme(value);
                  }}
                  className="grid grid-cols-2 gap-2 md:grid-cols-3"
                >
                  {availableThemes.map((theme) => (
                    <div key={theme.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} />
                      <Label htmlFor={`theme-${theme.id}`}>{theme.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          {/* Accessibility Settings */}
          <Card className="glass-panel glass-panel-hover">
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>
                Configure accessibility preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="high-contrast" 
                    checked={settings.highContrastMode}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, highContrastMode: checked === true }))
                    }
                  />
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="reduced-motion" 
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, reducedMotion: checked === true }))
                    }
                  />
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="large-text" 
                    checked={settings.largeText}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, largeText: checked === true }))
                    }
                  />
                  <Label htmlFor="large-text">Larger Text</Label>
                </div>
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
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="auto-save" 
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, autoSave: checked === true }))
                  }
                />
                <Label htmlFor="auto-save">Auto-save settings changes</Label>
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
